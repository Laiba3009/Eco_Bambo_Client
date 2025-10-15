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

      // Use proxy sync (proper CORS handling via Shopify App Proxy)
      await this.syncToShopifySession();
      console.log('[DirectCartSync] Proxy sync completed');

      // Small delay to ensure sync completes
      await new Promise(resolve => setTimeout(resolve, 2000));

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

      // First, clear the existing Shopify session cart using proxy
      try {
        await fetch('/api/proxy/cart?action=clear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('[DirectCartSync] Cleared existing Shopify cart via proxy');
      } catch (error) {
        console.warn('[DirectCartSync] Failed to clear cart via proxy:', error);
      }

      // Add each item to Shopify session cart using proxy
      for (const edge of headlessCart.lines.edges) {
        const item = edge.node;
        const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');

        try {
          const response = await fetch('/api/proxy/cart?action=add', {
            method: 'POST',
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
            console.log('[DirectCartSync] Added item to Shopify session via proxy:', {
              variantId,
              quantity: item.quantity,
              title: item.merchandise.title
            });
          } else {
            console.warn('[DirectCartSync] Failed to add item via proxy:', variantId, response.status);
          }
        } catch (error) {
          console.error('[DirectCartSync] Error adding item via proxy:', variantId, error);
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
   * Sync using hidden iframe method (CORS-free)
   */
  async syncViaIframe() {
    console.log('[DirectCartSync] Starting iframe sync...');

    try {
      const headlessCart = await cartManager.getCart();
      
      if (!headlessCart || !headlessCart.lines?.edges?.length) {
        console.log('[DirectCartSync] No items to sync');
        return { success: true, reason: 'No items' };
      }

      // First clear the cart using iframe
      try {
        const clearIframe = document.createElement('iframe');
        clearIframe.style.display = 'none';
        clearIframe.src = 'https://ecobambo.com/cart/clear';
        document.body.appendChild(clearIframe);
        
        setTimeout(() => {
          if (clearIframe.parentNode) {
            clearIframe.parentNode.removeChild(clearIframe);
          }
        }, 1000);
        
        console.log('[DirectCartSync] Cleared cart via iframe');
        
        // Wait for clear to complete
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.warn('[DirectCartSync] Failed to clear cart via iframe:', error);
      }

      // Add items using form submission in iframe
      for (const edge of headlessCart.lines.edges) {
        const item = edge.node;
        const variantId = item.merchandise.id.replace('gid://shopify/ProductVariant/', '');

        // Create a form and submit it in an iframe
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://ecobambo.com/cart/add';
        form.target = `cart-iframe-${variantId}`;
        form.style.display = 'none';

        // Add variant ID
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'id';
        idInput.value = variantId;
        form.appendChild(idInput);

        // Add quantity
        const qtyInput = document.createElement('input');
        qtyInput.type = 'hidden';
        qtyInput.name = 'quantity';
        qtyInput.value = item.quantity;
        form.appendChild(qtyInput);

        // Add return URL
        const returnInput = document.createElement('input');
        returnInput.type = 'hidden';
        returnInput.name = 'return_to';
        returnInput.value = '/cart';
        form.appendChild(returnInput);

        // Create iframe for this form
        const iframe = document.createElement('iframe');
        iframe.name = `cart-iframe-${variantId}`;
        iframe.style.display = 'none';
        
        document.body.appendChild(form);
        document.body.appendChild(iframe);

        // Submit form
        form.submit();

        console.log('[DirectCartSync] Added item via iframe form:', {
          variantId,
          quantity: item.quantity,
          title: item.merchandise.title
        });

        // Clean up after delay
        setTimeout(() => {
          if (form.parentNode) form.parentNode.removeChild(form);
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        }, 3000);

        // Small delay between items
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      console.log('[DirectCartSync] Iframe sync completed');
      return { success: true, method: 'iframe' };

    } catch (error) {
      console.error('[DirectCartSync] Iframe sync failed:', error);
      return { success: false, error: error.message };
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