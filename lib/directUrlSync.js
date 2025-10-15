// lib/directUrlSync.js
// Direct URL synchronization using Shopify's cart/add URLs

import cartManager from './cartManager';

/**
 * Direct URL Sync Service
 * Uses Shopify's direct cart/add URLs to sync cart items
 */
class DirectUrlSync {
  constructor() {
    this.syncInProgress = false;
  }

  /**
   * Sync cart to Shopify using direct cart/add URLs
   */
  async syncToShopifyCart() {
    if (this.syncInProgress) {
      console.log('[DirectUrlSync] Sync already in progress');
      return;
    }

    this.syncInProgress = true;
    console.log('[DirectUrlSync] Starting direct URL sync...');

    try {
      const headlessCart = await cartManager.getCart();
      
      if (!headlessCart || !headlessCart.lines?.edges?.length) {
        console.log('[DirectUrlSync] No items to sync');
        return { success: true, reason: 'No items' };
      }

      // Create hidden iframe for each item using direct Shopify URLs
      for (const edge of headlessCart.lines.edges) {
        const item = edge.node;
        const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');

        // Create direct Shopify cart/add URL
        const addUrl = `https://ecobambo.com/cart/add?id=${variantId}&quantity=${item.quantity}&return_to=/cart`;

        // Create hidden iframe to hit the URL
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.src = addUrl;
        
        document.body.appendChild(iframe);

        console.log('[DirectUrlSync] Added item via direct URL:', {
          variantId,
          quantity: item.quantity,
          title: item.merchandise.title,
          url: addUrl
        });

        // Remove iframe after delay
        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 2000);

        // Small delay between items to avoid overwhelming Shopify
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      console.log('[DirectUrlSync] Direct URL sync completed');
      return { success: true, method: 'direct_url' };

    } catch (error) {
      console.error('[DirectUrlSync] Direct URL sync failed:', error);
      return { success: false, error: error.message };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync and redirect to Shopify cart page
   */
  async syncAndRedirect(redirectTo = 'cart') {
    console.log('[DirectUrlSync] Starting sync and redirect...');

    try {
      const headlessCart = await cartManager.getCart();
      
      if (!headlessCart || !headlessCart.lines?.edges?.length) {
        console.log('[DirectUrlSync] No items to sync, redirecting to empty cart');
        window.open(`https://ecobambo.com/${redirectTo}`, '_blank');
        return;
      }

      // Clear Shopify cart first
      const clearIframe = document.createElement('iframe');
      clearIframe.style.display = 'none';
      clearIframe.src = 'https://ecobambo.com/cart/clear';
      document.body.appendChild(clearIframe);
      
      setTimeout(() => {
        if (clearIframe.parentNode) {
          clearIframe.parentNode.removeChild(clearIframe);
        }
      }, 1000);

      // Wait for clear to complete
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add all items using direct URLs
      for (const edge of headlessCart.lines.edges) {
        const item = edge.node;
        const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');

        const addUrl = `https://ecobambo.com/cart/add?id=${variantId}&quantity=${item.quantity}&return_to=/cart`;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = addUrl;
        document.body.appendChild(iframe);

        console.log('[DirectUrlSync] Adding item for redirect:', {
          variantId,
          quantity: item.quantity
        });

        setTimeout(() => {
          if (iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
          }
        }, 2000);

        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // Wait for all additions to complete, then redirect
      setTimeout(() => {
        console.log('[DirectUrlSync] Redirecting to Shopify after sync');
        window.open(`https://ecobambo.com/${redirectTo}`, '_blank');
      }, 2000);

    } catch (error) {
      console.error('[DirectUrlSync] Sync and redirect failed:', error);
      // Fallback to direct redirect
      window.open(`https://ecobambo.com/${redirectTo}`, '_blank');
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      syncInProgress: this.syncInProgress
    };
  }
}

// Export singleton instance
export const directUrlSync = new DirectUrlSync();
export default directUrlSync;