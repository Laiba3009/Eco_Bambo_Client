// lib/directCartSync.js
// Direct cart synchronization using Shopify's cart endpoints

import { getCartToken } from './cartTokenStorage';
import cartManager from './cartManager';

/**
 * Direct Cart Sync Service
 * Syncs cart directly to Shopify using form submissions and redirects
 */
class DirectCartSync {
  constructor() {
    this.syncInProgress = false;
  }

  /**
   * Sync current headless cart to Shopify session and redirect
   */
  async syncToShopifyAndRedirect(redirectTo = 'cart') {
    if (this.syncInProgress) {
      console.log('[DirectCartSync] Sync already in progress');
      return;
    }

    this.syncInProgress = true;
    console.log('[DirectCartSync] Starting direct sync to Shopify...');

    try {
      const headlessCart = await cartManager.getCart();
      
      if (!headlessCart || !headlessCart.lines?.edges?.length) {
        console.log('[DirectCartSync] No items to sync, redirecting to empty cart');
        window.open(`https://ecobambo.com/${redirectTo}`, '_blank');
        return;
      }

      console.log('[DirectCartSync] Syncing', headlessCart.lines.edges.length, 'items to Shopify session');

      // First sync to Shopify session using Ajax
      await this.syncToShopifySession();

      // Small delay to ensure sync completes
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Then redirect to the desired page
      console.log('[DirectCartSync] Redirecting to Shopify after session sync');
      window.open(`https://ecobambo.com/${redirectTo}`, '_blank');

    } catch (error) {
      console.error('[DirectCartSync] Sync failed:', error);
      // Fallback: try URL method
      try {
        const cartItems = headlessCart.lines.edges.map(edge => {
          const item = edge.node;
          const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');
          return `${variantId}:${item.quantity}`;
        });
        const cartString = cartItems.join(',');
        window.open(`https://ecobambo.com/cart/${cartString}`, '_blank');
      } catch (fallbackError) {
        window.open(`https://ecobambo.com/${redirectTo}`, '_blank');
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync to Shopify's session cart using Ajax endpoints
   */
  async syncToShopifySession() {
    if (this.syncInProgress) {
      console.log('[DirectCartSync] Sync already in progress');
      return;
    }

    this.syncInProgress = true;
    console.log('[DirectCartSync] Starting Ajax session sync...');

    try {
      const headlessCart = await cartManager.getCart();
      
      if (!headlessCart || !headlessCart.lines?.edges?.length) {
        console.log('[DirectCartSync] No items to sync');
        return { success: true, reason: 'No items' };
      }

      // First, clear the existing Shopify session cart
      try {
        await fetch('https://ecobambo.com/cart/clear.js', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('[DirectCartSync] Cleared existing Shopify cart');
      } catch (error) {
        console.warn('[DirectCartSync] Failed to clear cart:', error);
      }

      // Add each item to Shopify session cart using Ajax
      for (const edge of headlessCart.lines.edges) {
        const item = edge.node;
        const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');

        try {
          const response = await fetch('https://ecobambo.com/cart/add.js', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: variantId,
              quantity: item.quantity,
              properties: {
                '_synced_from': 'headless',
                '_sync_time': new Date().toISOString()
              }
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log('[DirectCartSync] Added item to Shopify session:', {
              variantId,
              quantity: item.quantity,
              title: item.merchandise.title
            });
          } else {
            console.warn('[DirectCartSync] Failed to add item:', variantId, response.status);
          }
        } catch (error) {
          console.error('[DirectCartSync] Error adding item:', variantId, error);
        }
      }

      console.log('[DirectCartSync] Ajax session sync completed');
      return { success: true, method: 'ajax_session' };

    } catch (error) {
      console.error('[DirectCartSync] Ajax session sync failed:', error);
      return { success: false, error: error.message };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      syncInProgress: this.syncInProgress,
      hasCartToken: !!getCartToken()
    };
  }
}

// Export singleton instance
export const directCartSync = new DirectCartSync();
export default directCartSync;