// lib/directSessionSync.js
// Direct session synchronization using Shopify's session endpoints

import cartManager from './cartManager';

/**
 * Direct Session Sync
 * Syncs cart by creating a new browser window that adds items and closes
 */
class DirectSessionSync {
  constructor() {
    this.syncInProgress = false;
  }

  /**
   * Sync cart by opening a popup window that adds items to Shopify session
   */
  async syncViaPopup() {
    if (this.syncInProgress) {
      console.log('[DirectSessionSync] Sync already in progress');
      return;
    }

    this.syncInProgress = true;
    console.log('[DirectSessionSync] Starting popup sync...');

    try {
      const headlessCart = await cartManager.getCart();
      
      if (!headlessCart || !headlessCart.lines?.edges?.length) {
        console.log('[DirectSessionSync] No items to sync');
        return { success: true, reason: 'No items' };
      }

      // Create popup window for each item
      for (const edge of headlessCart.lines.edges) {
        const item = edge.node;
        const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');

        // Create add to cart URL
        const addUrl = `https://ecobambo.com/cart/add?id=${variantId}&quantity=${item.quantity}&return_to=/cart`;

        // Open popup window
        const popup = window.open(
          addUrl,
          `add-to-cart-${variantId}`,
          'width=400,height=300,scrollbars=yes,resizable=yes'
        );

        console.log('[DirectSessionSync] Opened popup for item:', {
          variantId,
          quantity: item.quantity,
          title: item.merchandise.title
        });

        // Close popup after 2 seconds
        setTimeout(() => {
          if (popup && !popup.closed) {
            popup.close();
          }
        }, 2000);

        // Small delay between items
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('[DirectSessionSync] Popup sync completed');
      return { success: true, method: 'popup' };

    } catch (error) {
      console.error('[DirectSessionSync] Popup sync failed:', error);
      return { success: false, error: error.message };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync and redirect to Shopify cart
   */
  async syncAndRedirect(redirectTo = 'cart') {
    console.log('[DirectSessionSync] Starting sync and redirect...');

    try {
      // First sync via popup
      await this.syncViaPopup();

      // Wait for sync to complete
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Then redirect to Shopify
      console.log('[DirectSessionSync] Redirecting to Shopify after sync');
      window.open(`https://ecobambo.com/${redirectTo}`, '_blank');

    } catch (error) {
      console.error('[DirectSessionSync] Sync and redirect failed:', error);
      // Fallback to direct redirect
      window.open(`https://ecobambo.com/${redirectTo}`, '_blank');
    }
  }
}

// Export singleton instance
export const directSessionSync = new DirectSessionSync();
export default directSessionSync;