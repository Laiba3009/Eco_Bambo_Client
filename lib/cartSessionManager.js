// lib/cartSessionManager.js
// Handles cart session detection and synchronization between domains

import { getCartToken, setCartToken, removeCartToken } from './cartTokenStorage';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'ecobambo.com';

/**
 * Detect existing Shopify cart session from the main domain
 * This helps maintain cart continuity when users navigate from the main site
 */
export async function detectExistingCartSession() {
  console.log('[CartSessionManager] Detecting existing cart session...');
  
  try {
    // Use proxy to avoid CORS issues
    const response = await fetch('/api/proxy/cart?action=get', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const cartData = await response.json();
      
      if (cartData && cartData.token && cartData.token !== 'null') {
        console.log('[CartSessionManager] Found existing cart session:', {
          token: cartData.token,
          itemCount: cartData.item_count,
          totalPrice: cartData.total_price
        });
        
        // Convert Shopify cart token to GraphQL cart ID format
        const graphqlCartId = `gid://shopify/Cart/${cartData.token}`;
        
        return {
          found: true,
          token: cartData.token,
          graphqlId: graphqlCartId,
          itemCount: cartData.item_count || 0,
          totalPrice: cartData.total_price || 0,
          items: cartData.items || []
        };
      }
    }
    
    console.log('[CartSessionManager] No existing cart session found');
    return { found: false };
    
  } catch (error) {
    console.warn('[CartSessionManager] Failed to detect existing cart session:', error);
    return { found: false, error: error.message };
  }
}

/**
 * Attempt to sync with existing Shopify cart session
 * This should be called when the app initializes
 */
export async function syncWithExistingSession() {
  console.log('[CartSessionManager] Syncing with existing session...');
  
  const currentToken = getCartToken();
  const existingSession = await detectExistingCartSession();
  
  if (existingSession.found) {
    // If we don't have a token, or if the existing session has items, use it
    if (!currentToken || existingSession.itemCount > 0) {
      console.log('[CartSessionManager] Using existing Shopify cart session');
      setCartToken(existingSession.graphqlId);
      return {
        synced: true,
        token: existingSession.graphqlId,
        itemCount: existingSession.itemCount,
        source: 'shopify_session'
      };
    }
  }
  
  // If we have a current token and no existing session, keep our token
  if (currentToken) {
    console.log('[CartSessionManager] Keeping current cart token');
    return {
      synced: true,
      token: currentToken,
      source: 'local_storage'
    };
  }
  
  // No session found anywhere
  console.log('[CartSessionManager] No cart session to sync');
  return {
    synced: false,
    source: 'none'
  };
}

/**
 * Create a cart session that's compatible with Shopify's native cart
 * This ensures our cart can be accessed from the main Shopify theme
 */
export async function createCompatibleCartSession(cartId) {
  console.log('[CartSessionManager] Creating compatible cart session for:', cartId);
  
  try {
    // Extract the numeric cart ID from GraphQL ID
    const numericId = cartId.replace('gid://shopify/Cart/', '');
    
    // Try to set the cart session via proxy
    const response = await fetch('/api/proxy/cart?action=update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        attributes: {
          '_cart_token': numericId,
          '_headless_cart': 'true',
          '_sync_timestamp': new Date().toISOString()
        }
      })
    });
    
    if (response.ok) {
      console.log('[CartSessionManager] Cart session created successfully');
      return { success: true };
    } else {
      console.warn('[CartSessionManager] Failed to create cart session:', response.status);
      return { success: false, status: response.status };
    }
    
  } catch (error) {
    console.warn('[CartSessionManager] Error creating compatible cart session:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if current cart session is still valid
 * This helps detect when a cart has been cleared or expired on Shopify's side
 */
export async function validateCartSession(cartToken) {
  if (!cartToken) return false;
  
  try {
    // Try to get cart data via proxy
    const numericToken = cartToken.replace('gid://shopify/Cart/', '');
    const response = await fetch('/api/proxy/cart?action=get', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      const cartData = await response.json();
      return cartData && cartData.token === numericToken;
    }
    
    return false;
  } catch (error) {
    console.warn('[CartSessionManager] Error validating cart session:', error);
    return false;
  }
}

/**
 * Merge cart items from different sources
 * This handles cases where items exist in both local storage and Shopify cart
 */
export function mergeCartItems(localItems = [], shopifyItems = []) {
  console.log('[CartSessionManager] Merging cart items:', {
    localCount: localItems.length,
    shopifyCount: shopifyItems.length
  });
  
  const mergedItems = [...shopifyItems]; // Start with Shopify items (authoritative)
  
  // Add local items that don't exist in Shopify cart
  localItems.forEach(localItem => {
    const existsInShopify = shopifyItems.some(shopifyItem => 
      shopifyItem.variant_id === localItem.variantId ||
      shopifyItem.id === localItem.variantId
    );
    
    if (!existsInShopify) {
      // Convert local item format to Shopify format
      mergedItems.push({
        id: localItem.variantId,
        variant_id: localItem.variantId,
        quantity: localItem.quantity,
        title: localItem.product?.title || 'Unknown Product',
        // Add other necessary fields
      });
    }
  });
  
  console.log('[CartSessionManager] Merged items count:', mergedItems.length);
  return mergedItems;
}

/**
 * Handle cart session conflicts
 * This is called when there are discrepancies between local and remote cart state
 */
export async function resolveCartConflict(localCart, remoteCart) {
  console.log('[CartSessionManager] Resolving cart conflict...');
  
  // Strategy: Prefer remote cart if it has more recent activity or more items
  const localItemCount = localCart?.items?.length || 0;
  const remoteItemCount = remoteCart?.items?.length || 0;
  
  if (remoteItemCount > localItemCount) {
    console.log('[CartSessionManager] Using remote cart (more items)');
    return {
      resolution: 'use_remote',
      cart: remoteCart,
      reason: 'Remote cart has more items'
    };
  }
  
  if (localItemCount > 0 && remoteItemCount === 0) {
    console.log('[CartSessionManager] Using local cart (has items, remote empty)');
    return {
      resolution: 'use_local',
      cart: localCart,
      reason: 'Local cart has items, remote is empty'
    };
  }
  
  // Default to remote cart for consistency
  console.log('[CartSessionManager] Using remote cart (default)');
  return {
    resolution: 'use_remote',
    cart: remoteCart,
    reason: 'Default to remote for consistency'
  };
}

/**
 * Initialize cart session management
 * This should be called when the app starts
 */
export async function initializeCartSession() {
  console.log('[CartSessionManager] Initializing cart session...');
  
  try {
    const syncResult = await syncWithExistingSession();
    
    if (syncResult.synced) {
      console.log('[CartSessionManager] Cart session initialized:', syncResult);
      return {
        success: true,
        token: syncResult.token,
        source: syncResult.source,
        itemCount: syncResult.itemCount || 0
      };
    } else {
      console.log('[CartSessionManager] No existing session found, will create new cart when needed');
      return {
        success: true,
        token: null,
        source: 'none',
        itemCount: 0
      };
    }
  } catch (error) {
    console.error('[CartSessionManager] Failed to initialize cart session:', error);
    return {
      success: false,
      error: error.message
    };
  }
}