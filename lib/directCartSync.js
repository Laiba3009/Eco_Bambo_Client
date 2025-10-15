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
   * Sync current headless cart to Shopify by redirecting with cart data
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

      console.log('[DirectCartSync] Syncing', headlessCart.lines.edges.length, 'items to Shopify');

      // Build cart URL with all items
      const cartItems = headlessCart.lines.edges.map(edge => {
        const item = edge.node;
        const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');
        return `${variantId}:${item.quantity}`;
      });

      const cartString = cartItems.join(',');
      const shopifyCartUrl = `https://ecobambo.com/cart/${cartString}`;

      console.log('[DirectCartSync] Redirecting to Shopify with cart:', {
        itemCount: cartItems.length,
        totalQuantity: headlessCart.totalQuantity,
        cartString: cartString.substring(0, 100) + '...'
      });

      // Redirect to Shopify with pre-filled cart
      window.open(shopifyCartUrl, '_blank');

    } catch (error) {
      console.error('[DirectCartSync] Sync failed:', error);
      // Fallback to regular cart page
      window.open(`https://ecobambo.com/${redirectTo}`, '_blank');
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Create a form and submit it to add items to Shopify cart
   */
  async syncViaFormSubmission() {
    if (this.syncInProgress) {
      console.log('[DirectCartSync] Sync already in progress');
      return;
    }

    this.syncInProgress = true;
    console.log('[DirectCartSync] Starting form submission sync...');

    try {
      const headlessCart = await cartManager.getCart();
      
      if (!headlessCart || !headlessCart.lines?.edges?.length) {
        console.log('[DirectCartSync] No items to sync');
        return { success: true, reason: 'No items' };
      }

      // Create a hidden form to submit to Shopify
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://ecobambo.com/cart/add';
      form.target = '_blank';
      form.style.display = 'none';

      // Add items to form
      headlessCart.lines.edges.forEach((edge, index) => {
        const item = edge.node;
        const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');

        // Create input for variant ID
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = `items[${index}][id]`;
        idInput.value = variantId;
        form.appendChild(idInput);

        // Create input for quantity
        const qtyInput = document.createElement('input');
        qtyInput.type = 'hidden';
        qtyInput.name = `items[${index}][quantity]`;
        qtyInput.value = item.quantity;
        form.appendChild(qtyInput);
      });

      // Add return URL
      const returnInput = document.createElement('input');
      returnInput.type = 'hidden';
      returnInput.name = 'return_to';
      returnInput.value = '/cart';
      form.appendChild(returnInput);

      // Submit form
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      console.log('[DirectCartSync] Form submitted successfully');
      return { success: true, method: 'form_submission' };

    } catch (error) {
      console.error('[DirectCartSync] Form submission failed:', error);
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