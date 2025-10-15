// lib/cartProxySync.js
// Enhanced cart synchronization using Shopify App Proxy

import { getCartToken, setCartToken } from './cartTokenStorage';
import cartManager from './cartManager';

/**
 * Cart Proxy Sync Service
 * Handles bidirectional cart synchronization between headless app and Shopify store
 */
class CartProxySync {
  constructor() {
    this.syncInProgress = false;
    this.lastSyncTime = null;
  }

  /**
   * Sync headless cart to Shopify store
   */
  async syncToShopify() {
    if (this.syncInProgress) {
      console.log('[CartProxySync] Sync already in progress');
      return { success: false, reason: 'Sync in progress' };
    }

    this.syncInProgress = true;
    console.log('[CartProxySync] Starting sync to Shopify...');

    try {
      const headlessCart = await cartManager.getCart();
      
      if (!headlessCart || !headlessCart.lines?.edges?.length) {
        console.log('[CartProxySync] No items to sync');
        return { success: true, reason: 'No items to sync' };
      }

      // Get current Shopify cart
      const shopifyCartResponse = await fetch('/api/proxy/cart?action=get');
      const shopifyCart = await shopifyCartResponse.json();

      console.log('[CartProxySync] Current carts:', {
        headless: headlessCart.totalQuantity,
        shopify: shopifyCart.item_count || 0
      });

      // Clear Shopify cart first
      await fetch('/api/proxy/cart?action=clear', { method: 'POST' });

      // Add each item from headless cart to Shopify
      for (const edge of headlessCart.lines.edges) {
        const item = edge.node;
        const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');

        await fetch('/api/proxy/cart?action=add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: variantId,
            quantity: item.quantity,
            properties: {
              '_synced_from': 'headless',
              '_sync_time': new Date().toISOString()
            }
          })
        });

        console.log('[CartProxySync] Added item to Shopify:', {
          variantId,
          quantity: item.quantity
        });
      }

      this.lastSyncTime = new Date();
      console.log('[CartProxySync] Sync to Shopify completed successfully');

      return {
        success: true,
        itemsSynced: headlessCart.lines.edges.length,
        totalQuantity: headlessCart.totalQuantity
      };

    } catch (error) {
      console.error('[CartProxySync] Sync to Shopify failed:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync Shopify cart to headless app
   */
  async syncFromShopify() {
    if (this.syncInProgress) {
      console.log('[CartProxySync] Sync already in progress');
      return { success: false, reason: 'Sync in progress' };
    }

    this.syncInProgress = true;
    console.log('[CartProxySync] Starting sync from Shopify...');

    try {
      // Get Shopify cart
      const response = await fetch('/api/proxy/cart?action=get');
      const shopifyCart = await response.json();

      if (!shopifyCart.items || shopifyCart.items.length === 0) {
        console.log('[CartProxySync] No Shopify items to sync');
        return { success: true, reason: 'No Shopify items' };
      }

      console.log('[CartProxySync] Found Shopify items:', shopifyCart.items.length);

      // Create new headless cart or get existing
      await cartManager.getOrCreateCart();

      // Add each Shopify item to headless cart
      for (const item of shopifyCart.items) {
        const variantId = item.variant_id || item.id;
        
        await cartManager.addToCart(variantId, item.quantity);
        
        console.log('[CartProxySync] Added item to headless cart:', {
          variantId,
          quantity: item.quantity,
          title: item.title
        });
      }

      this.lastSyncTime = new Date();
      console.log('[CartProxySync] Sync from Shopify completed successfully');

      return {
        success: true,
        itemsSynced: shopifyCart.items.length,
        totalQuantity: shopifyCart.item_count
      };

    } catch (error) {
      console.error('[CartProxySync] Sync from Shopify failed:', error);
      return {
        success: false,
        error: error.message
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Bidirectional sync - merge carts intelligently
   */
  async bidirectionalSync() {
    console.log('[CartProxySync] Starting bidirectional sync...');

    try {
      // Get both carts
      const [headlessCart, shopifyResponse] = await Promise.all([
        cartManager.getCart(),
        fetch('/api/proxy/cart?action=get').then(r => r.json())
      ]);

      const headlessItemCount = headlessCart?.totalQuantity || 0;
      const shopifyItemCount = shopifyResponse?.item_count || 0;

      console.log('[CartProxySync] Cart comparison:', {
        headless: headlessItemCount,
        shopify: shopifyItemCount
      });

      // Determine sync direction
      if (headlessItemCount > shopifyItemCount) {
        console.log('[CartProxySync] Headless cart has more items, syncing to Shopify');
        return await this.syncToShopify();
      } else if (shopifyItemCount > headlessItemCount) {
        console.log('[CartProxySync] Shopify cart has more items, syncing to headless');
        return await this.syncFromShopify();
      } else if (headlessItemCount === 0 && shopifyItemCount === 0) {
        console.log('[CartProxySync] Both carts empty, no sync needed');
        return { success: true, reason: 'Both carts empty' };
      } else {
        // Same item count - use timestamp or default to Shopify
        console.log('[CartProxySync] Same item count, using Shopify as source of truth');
        return await this.syncFromShopify();
      }

    } catch (error) {
      console.error('[CartProxySync] Bidirectional sync failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test proxy connection
   */
  async testConnection() {
    try {
      const response = await fetch('/api/proxy/test');
      const data = await response.json();
      
      console.log('[CartProxySync] Proxy test result:', data);
      
      return {
        success: response.ok,
        data: data
      };
    } catch (error) {
      console.error('[CartProxySync] Proxy test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      syncInProgress: this.syncInProgress,
      lastSyncTime: this.lastSyncTime,
      hasCartToken: !!getCartToken()
    };
  }
}

// Export singleton instance
export const cartProxySync = new CartProxySync();
export default cartProxySync;