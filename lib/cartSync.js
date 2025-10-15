// lib/cartSync.js
// Cart synchronization service for cross-domain cart management

import cartManager from './cartManager';
import { getCartToken, setCartToken, removeCartToken } from './cartTokenStorage';
import { detectExistingCartSession, syncWithExistingSession } from './cartSessionManager';

/**
 * Cart Synchronization Service
 * Handles cart state synchronization between headless app and Shopify theme
 */
class CartSyncService {
  constructor() {
    this.syncInProgress = false;
    this.lastSyncTime = null;
    this.syncInterval = null;
  }

  /**
   * Initialize cart synchronization
   * Should be called when the app starts
   */
  async initialize() {
    console.log('[CartSync] Initializing cart synchronization...');
    
    try {
      // Perform initial sync
      await this.performSync();
      
      // Set up periodic sync (every 30 seconds)
      this.startPeriodicSync();
      
      // Listen for visibility changes to sync when user returns to tab
      this.setupVisibilityListener();
      
      console.log('[CartSync] Cart synchronization initialized');
      return { success: true };
    } catch (error) {
      console.error('[CartSync] Failed to initialize cart sync:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Perform cart synchronization between domains
   */
  async performSync() {
    if (this.syncInProgress) {
      console.log('[CartSync] Sync already in progress, skipping...');
      return;
    }

    this.syncInProgress = true;
    console.log('[CartSync] Starting cart synchronization...');

    try {
      // Get current local cart state
      const localToken = getCartToken();
      const localCart = localToken ? await cartManager.getCart() : null;

      // Detect existing Shopify cart session
      const shopifySession = await detectExistingCartSession();

      // Determine sync strategy
      const syncStrategy = this.determineSyncStrategy(localCart, shopifySession);
      console.log('[CartSync] Sync strategy:', syncStrategy.action);

      switch (syncStrategy.action) {
        case 'use_shopify':
          await this.useShopifyCart(shopifySession);
          break;
        case 'use_local':
          await this.useLocalCart(localCart);
          break;
        case 'merge_carts':
          await this.mergeCarts(localCart, shopifySession);
          break;
        case 'no_action':
          console.log('[CartSync] No synchronization needed');
          break;
      }

      this.lastSyncTime = new Date();
      console.log('[CartSync] Synchronization completed successfully');

    } catch (error) {
      console.error('[CartSync] Synchronization failed:', error);
      throw error;
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Determine the best synchronization strategy
   */
  determineSyncStrategy(localCart, shopifySession) {
    const localItemCount = localCart?.totalQuantity || 0;
    const shopifyItemCount = shopifySession.itemCount || 0;

    // If no carts exist, no action needed
    if (localItemCount === 0 && shopifyItemCount === 0) {
      return { action: 'no_action', reason: 'No items in either cart' };
    }

    // If only Shopify cart has items, use it
    if (localItemCount === 0 && shopifyItemCount > 0) {
      return { action: 'use_shopify', reason: 'Only Shopify cart has items' };
    }

    // If only local cart has items, use it
    if (localItemCount > 0 && shopifyItemCount === 0) {
      return { action: 'use_local', reason: 'Only local cart has items' };
    }

    // If both have items, prefer Shopify cart (authoritative source)
    if (localItemCount > 0 && shopifyItemCount > 0) {
      return { action: 'use_shopify', reason: 'Both carts have items, using Shopify as authoritative' };
    }

    return { action: 'no_action', reason: 'Default case' };
  }

  /**
   * Use Shopify cart as the source of truth
   */
  async useShopifyCart(shopifySession) {
    console.log('[CartSync] Using Shopify cart as source of truth');
    
    if (shopifySession.found && shopifySession.graphqlId) {
      // Update local token to match Shopify cart
      setCartToken(shopifySession.graphqlId);
      
      // Refresh cart manager with new token
      await cartManager.getCart();
      
      console.log('[CartSync] Local cart updated to match Shopify cart');
    }
  }

  /**
   * Use local cart as the source of truth
   */
  async useLocalCart(localCart) {
    console.log('[CartSync] Using local cart as source of truth');
    
    if (localCart && localCart.id) {
      // Local cart is already the active one, just ensure it's synced
      await cartManager.ensureCartContinuity();
      console.log('[CartSync] Local cart confirmed as active');
    }
  }

  /**
   * Merge carts when both have items (advanced feature)
   */
  async mergeCarts(localCart, shopifySession) {
    console.log('[CartSync] Merging carts (using Shopify as primary)');
    
    // For now, we'll use Shopify cart as primary and log the merge
    // In a full implementation, you might want to add local items to Shopify cart
    await this.useShopifyCart(shopifySession);
    
    console.log('[CartSync] Cart merge completed (Shopify cart used as primary)');
  }

  /**
   * Force synchronization with Shopify cart
   */
  async forceSyncWithShopify() {
    console.log('[CartSync] Forcing sync with Shopify...');
    
    try {
      const syncResult = await syncWithExistingSession();
      
      if (syncResult.synced) {
        await cartManager.getCart(); // Refresh cart data
        console.log('[CartSync] Force sync completed:', syncResult);
        return { success: true, result: syncResult };
      } else {
        console.log('[CartSync] No Shopify session to sync with');
        return { success: false, reason: 'No Shopify session found' };
      }
    } catch (error) {
      console.error('[CartSync] Force sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Start periodic synchronization
   */
  startPeriodicSync(intervalMs = 30000) { // 30 seconds
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      try {
        await this.performSync();
      } catch (error) {
        console.warn('[CartSync] Periodic sync failed:', error);
      }
    }, intervalMs);

    console.log('[CartSync] Periodic sync started (interval:', intervalMs, 'ms)');
  }

  /**
   * Stop periodic synchronization
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[CartSync] Periodic sync stopped');
    }
  }

  /**
   * Setup visibility change listener for sync on tab focus
   */
  setupVisibilityListener() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
          console.log('[CartSync] Tab became visible, performing sync...');
          try {
            await this.performSync();
          } catch (error) {
            console.warn('[CartSync] Visibility sync failed:', error);
          }
        }
      });
    }
  }

  /**
   * Sync cart after adding items (called by AddToCart component)
   */
  async syncAfterCartUpdate() {
    console.log('[CartSync] Syncing after cart update...');
    
    try {
      // Small delay to ensure cart update is processed
      setTimeout(async () => {
        await this.performSync();
      }, 1000);
    } catch (error) {
      console.warn('[CartSync] Post-update sync failed:', error);
    }
  }

  /**
   * Get synchronization status
   */
  getSyncStatus() {
    return {
      syncInProgress: this.syncInProgress,
      lastSyncTime: this.lastSyncTime,
      hasPeriodicSync: !!this.syncInterval,
      currentCartToken: getCartToken()
    };
  }

  /**
   * Manual sync trigger (for debugging or user-initiated sync)
   */
  async manualSync() {
    console.log('[CartSync] Manual sync triggered...');
    
    try {
      await this.performSync();
      return { success: true, timestamp: new Date() };
    } catch (error) {
      console.error('[CartSync] Manual sync failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reset cart synchronization (clear all cart data)
   */
  async resetSync() {
    console.log('[CartSync] Resetting cart synchronization...');
    
    try {
      // Stop periodic sync
      this.stopPeriodicSync();
      
      // Clear cart tokens
      removeCartToken();
      
      // Reset cart manager
      cartManager.cartToken = null;
      cartManager.cartData = null;
      cartManager.initialized = false;
      
      // Reinitialize
      await this.initialize();
      
      console.log('[CartSync] Cart sync reset completed');
      return { success: true };
    } catch (error) {
      console.error('[CartSync] Reset failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const cartSyncService = new CartSyncService();
export default cartSyncService;