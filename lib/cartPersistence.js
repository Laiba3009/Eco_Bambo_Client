// lib/cartPersistence.js
// Enhanced cart persistence across browser sessions

import { getCartToken, setCartToken, removeCartToken, isCartTokenExpired } from './cartTokenStorage';
import { detectExistingCartSession } from './cartSessionManager';
import cartManager from './cartManager';

/**
 * Cart Persistence Manager
 * Handles cart restoration and persistence across browser sessions
 */
class CartPersistenceManager {
  constructor() {
    this.restorationAttempted = false;
    this.persistenceEnabled = true;
  }

  /**
   * Initialize cart persistence when app starts
   */
  async initializePersistence() {
    console.log('[CartPersistence] Initializing cart persistence...');
    
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        console.log('[CartPersistence] Server-side rendering, skipping initialization');
        return { success: false, reason: 'SSR environment' };
      }

      // Attempt to restore cart from previous session
      const restorationResult = await this.restoreCartFromSession();
      
      // Set up persistence listeners
      this.setupPersistenceListeners();
      
      console.log('[CartPersistence] Cart persistence initialized:', restorationResult);
      return { success: true, restoration: restorationResult };
      
    } catch (error) {
      console.error('[CartPersistence] Failed to initialize persistence:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Restore cart from previous browser session
   */
  async restoreCartFromSession() {
    if (this.restorationAttempted) {
      console.log('[CartPersistence] Restoration already attempted');
      return { restored: false, reason: 'Already attempted' };
    }

    this.restorationAttempted = true;
    console.log('[CartPersistence] Attempting to restore cart from session...');

    try {
      // Check for existing cart token
      const existingToken = getCartToken();
      
      if (existingToken && !isCartTokenExpired()) {
        console.log('[CartPersistence] Found valid cart token, attempting restoration...');
        
        // Try to restore cart using existing token
        const restoredCart = await this.restoreFromToken(existingToken);
        
        if (restoredCart.success) {
          return {
            restored: true,
            method: 'token',
            cartId: existingToken,
            itemCount: restoredCart.itemCount
          };
        }
      }

      // If token restoration failed, try to detect Shopify session
      console.log('[CartPersistence] Token restoration failed, checking Shopify session...');
      const shopifySession = await detectExistingCartSession();
      
      if (shopifySession.found && shopifySession.itemCount > 0) {
        console.log('[CartPersistence] Found Shopify session with items, using it...');
        
        // Use Shopify session as cart source
        setCartToken(shopifySession.graphqlId);
        await cartManager.getCart();
        
        return {
          restored: true,
          method: 'shopify_session',
          cartId: shopifySession.graphqlId,
          itemCount: shopifySession.itemCount
        };
      }

      // No cart to restore
      console.log('[CartPersistence] No cart found to restore');
      return {
        restored: false,
        reason: 'No valid cart found'
      };

    } catch (error) {
      console.error('[CartPersistence] Cart restoration failed:', error);
      
      // Clean up invalid tokens on restoration failure
      removeCartToken();
      
      return {
        restored: false,
        error: error.message
      };
    }
  }

  /**
   * Restore cart from a specific token
   */
  async restoreFromToken(token) {
    try {
      console.log('[CartPersistence] Restoring cart from token:', token);
      
      // Initialize cart manager if needed
      if (!cartManager.initialized) {
        await cartManager.initialize();
      }

      // Try to get cart data
      const cartData = await cartManager.getCart();
      
      if (cartData && cartData.id) {
        const summary = cartManager.getCartSummary();
        console.log('[CartPersistence] Cart restored successfully:', {
          cartId: cartData.id,
          itemCount: summary.totalQuantity
        });
        
        return {
          success: true,
          cartData: cartData,
          itemCount: summary.totalQuantity
        };
      } else {
        console.warn('[CartPersistence] Cart token is invalid or cart is empty');
        return { success: false, reason: 'Invalid or empty cart' };
      }

    } catch (error) {
      console.error('[CartPersistence] Failed to restore from token:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Setup persistence listeners for browser events
   */
  setupPersistenceListeners() {
    if (typeof window === 'undefined') return;

    // Save cart state before page unload
    window.addEventListener('beforeunload', () => {
      this.saveCartState();
    });

    // Restore cart when page becomes visible (user returns to tab)
    document.addEventListener('visibilitychange', async () => {
      if (!document.hidden) {
        console.log('[CartPersistence] Page became visible, checking cart state...');
        await this.validateAndRefreshCart();
      }
    });

    // Handle storage events (cart updated in another tab)
    window.addEventListener('storage', (event) => {
      if (event.key === 'shopify_cart_token') {
        console.log('[CartPersistence] Cart token updated in another tab');
        this.handleCrossTabCartUpdate(event.newValue);
      }
    });

    console.log('[CartPersistence] Persistence listeners setup complete');
  }

  /**
   * Save current cart state
   */
  saveCartState() {
    try {
      const cartToken = getCartToken();
      if (cartToken) {
        const cartSummary = cartManager.getCartSummary();
        
        // Save additional cart metadata
        const cartMetadata = {
          lastSaved: new Date().toISOString(),
          itemCount: cartSummary.totalQuantity,
          totalAmount: cartSummary.totalAmount,
          currencyCode: cartSummary.currencyCode
        };
        
        localStorage.setItem('cart_metadata', JSON.stringify(cartMetadata));
        console.log('[CartPersistence] Cart state saved:', cartMetadata);
      }
    } catch (error) {
      console.warn('[CartPersistence] Failed to save cart state:', error);
    }
  }

  /**
   * Validate and refresh cart (called when page becomes visible)
   */
  async validateAndRefreshCart() {
    try {
      const cartToken = getCartToken();
      
      if (cartToken && !isCartTokenExpired()) {
        // Refresh cart data to ensure it's current
        await cartManager.getCart();
        console.log('[CartPersistence] Cart validated and refreshed');
      } else if (cartToken && isCartTokenExpired()) {
        console.log('[CartPersistence] Cart token expired, attempting recovery...');
        await this.recoverExpiredCart();
      }
    } catch (error) {
      console.warn('[CartPersistence] Cart validation failed:', error);
    }
  }

  /**
   * Handle cart updates from other tabs
   */
  async handleCrossTabCartUpdate(newToken) {
    try {
      if (newToken && newToken !== getCartToken()) {
        console.log('[CartPersistence] Cart updated in another tab, syncing...');
        
        // Update local token
        setCartToken(newToken);
        
        // Refresh cart data
        await cartManager.getCart();
        
        // Trigger cart context refresh if available
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { source: 'cross_tab', token: newToken } 
        }));
      }
    } catch (error) {
      console.warn('[CartPersistence] Cross-tab sync failed:', error);
    }
  }

  /**
   * Recover from expired cart token
   */
  async recoverExpiredCart() {
    try {
      console.log('[CartPersistence] Recovering from expired cart...');
      
      // Remove expired token
      removeCartToken();
      
      // Try to detect existing Shopify session
      const shopifySession = await detectExistingCartSession();
      
      if (shopifySession.found) {
        console.log('[CartPersistence] Found Shopify session for recovery');
        setCartToken(shopifySession.graphqlId);
        await cartManager.getCart();
        return { recovered: true, method: 'shopify_session' };
      } else {
        console.log('[CartPersistence] No session found for recovery');
        return { recovered: false, reason: 'No session available' };
      }
    } catch (error) {
      console.error('[CartPersistence] Cart recovery failed:', error);
      return { recovered: false, error: error.message };
    }
  }

  /**
   * Get cart metadata from previous session
   */
  getCartMetadata() {
    try {
      const metadata = localStorage.getItem('cart_metadata');
      return metadata ? JSON.parse(metadata) : null;
    } catch (error) {
      console.warn('[CartPersistence] Failed to get cart metadata:', error);
      return null;
    }
  }

  /**
   * Clear all persistence data (for debugging/reset)
   */
  clearPersistenceData() {
    try {
      removeCartToken();
      localStorage.removeItem('cart_metadata');
      localStorage.removeItem('cart'); // Legacy cart data
      
      console.log('[CartPersistence] All persistence data cleared');
      return { success: true };
    } catch (error) {
      console.error('[CartPersistence] Failed to clear persistence data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get persistence status for debugging
   */
  getPersistenceStatus() {
    const cartToken = getCartToken();
    const metadata = this.getCartMetadata();
    
    return {
      hasToken: !!cartToken,
      tokenExpired: cartToken ? isCartTokenExpired() : null,
      restorationAttempted: this.restorationAttempted,
      persistenceEnabled: this.persistenceEnabled,
      metadata: metadata,
      cartSummary: cartManager.getCartSummary()
    };
  }
}

// Export singleton instance
export const cartPersistenceManager = new CartPersistenceManager();
export default cartPersistenceManager;