// lib/cartManager.js
import { shopifyFetch } from './shopify';
import { 
  getCartToken, 
  setCartToken, 
  removeCartToken, 
  isCartTokenExpired,
  updateLastSyncTime 
} from './cartTokenStorage';
import { 
  initializeCartSession,
  syncWithExistingSession,
  validateCartSession 
} from './cartSessionManager';
import cartLogger from './cartLogger';

class CartManager {
  constructor() {
    this.cartToken = null;
    this.cartData = null;
    this.initialized = false;
  }

  // Initialize cart manager with session detection
  async initialize() {
    if (this.initialized) {
      cartLogger.debug('CartManager', 'Already initialized, skipping');
      return;
    }
    
    cartLogger.operationStart('CartManager', 'initialize');
    
    try {
      cartLogger.info('CartManager', 'Starting initialization with session detection');
      
      const sessionResult = await initializeCartSession();
      
      if (sessionResult.success && sessionResult.token) {
        this.cartToken = sessionResult.token;
        cartLogger.info('CartManager', 'Initialized with existing session', {
          source: sessionResult.source,
          token: sessionResult.token?.substring(0, 20) + '...'
        });
      } else {
        cartLogger.info('CartManager', 'No existing session found, will create cart when needed');
      }
      
      this.initialized = true;
      cartLogger.operationSuccess('CartManager', 'initialize', { 
        hasToken: !!this.cartToken,
        source: sessionResult.source 
      });
      
      return sessionResult;
    } catch (error) {
      cartLogger.operationFailure('CartManager', 'initialize', error);
      this.initialized = true; // Mark as initialized even on error to prevent loops
      throw error;
    }
  }

  // Ensure cart manager is initialized before operations
  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  // Create a new cart using Shopify's Cart API
  async createCart() {
    cartLogger.operationStart('CartManager', 'createCart');
    const CREATE_CART_MUTATION = `
      mutation cartCreate {
        cartCreate {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      cartLogger.info('CartManager', 'Creating new cart via Shopify API');
      cartLogger.apiCall('CartManager', 'POST', 'cartCreate mutation');
      
      const startTime = Date.now();
      const data = await shopifyFetch({ query: CREATE_CART_MUTATION });
      const duration = Date.now() - startTime;
      
      cartLogger.apiResponse('CartManager', 'POST', 'cartCreate', { ok: true }, duration);
      
      if (data.cartCreate.userErrors.length > 0) {
        const errorMessage = data.cartCreate.userErrors.map(e => e.message).join(', ');
        cartLogger.error('CartManager', 'Cart creation failed with user errors', null, {
          userErrors: data.cartCreate.userErrors
        });
        throw new Error(`Cart creation failed: ${errorMessage}`);
      }

      const cart = data.cartCreate.cart;
      setCartToken(cart.id);
      this.cartToken = cart.id;
      this.cartData = cart;
      
      cartLogger.operationSuccess('CartManager', 'createCart', {
        cartId: cart.id,
        totalQuantity: cart.totalQuantity,
        checkoutUrl: !!cart.checkoutUrl
      });
      
      return cart;
    } catch (error) {
      cartLogger.operationFailure('CartManager', 'createCart', error);
      throw error;
    }
  }

  // Get existing cart or create new one
  async getOrCreateCart() {
    cartLogger.operationStart('CartManager', 'getOrCreateCart');
    
    await this.ensureInitialized();
    
    const existingToken = getCartToken();
    const isExpired = isCartTokenExpired();
    
    cartLogger.debug('CartManager', 'Checking existing cart token', {
      hasToken: !!existingToken,
      isExpired: isExpired,
      tokenPreview: existingToken?.substring(0, 20) + '...'
    });
    
    // If we have a token and it's not expired, try to get the cart
    if (existingToken && !isExpired) {
      try {
        cartLogger.info('CartManager', 'Validating existing cart session');
        
        // Validate the session is still active
        const isValid = await validateCartSession(existingToken);
        if (!isValid) {
          cartLogger.warn('CartManager', 'Cart session is no longer valid, attempting sync');
          await syncWithExistingSession();
        }
        
        const cart = await this.getCart();
        if (cart) {
          cartLogger.operationSuccess('CartManager', 'getOrCreateCart', {
            method: 'existing',
            cartId: cart.id,
            totalQuantity: cart.totalQuantity
          });
          return cart;
        }
      } catch (error) {
        cartLogger.warn('CartManager', 'Failed to get existing cart, will create new one', error);
        removeCartToken();
      }
    } else if (existingToken && isExpired) {
      cartLogger.warn('CartManager', 'Cart token expired, removing and creating new cart');
      removeCartToken();
    }

    // Create new cart if no valid existing cart
    cartLogger.info('CartManager', 'No valid existing cart found, creating new one');
    const newCart = await this.createCart();
    
    cartLogger.operationSuccess('CartManager', 'getOrCreateCart', {
      method: 'created',
      cartId: newCart.id
    });
    
    return newCart;
  }

  // Get cart data using Cart API
  async getCart() {
    await this.ensureInitialized();
    
    const cartToken = getCartToken();
    if (!cartToken) {
      return null;
    }

    const GET_CART_QUERY = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    image {
                      url
                      altText
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      console.log('[CartManager] Fetching cart:', cartToken);
      const data = await shopifyFetch({ 
        query: GET_CART_QUERY, 
        variables: { cartId: cartToken } 
      });
      
      if (!data.cart) {
        console.warn('[CartManager] Cart not found, token may be invalid');
        removeCartToken();
        return null;
      }

      this.cartData = data.cart;
      updateLastSyncTime();
      return data.cart;
    } catch (error) {
      console.error('[CartManager] Failed to get cart:', error);
      // If cart is not found, remove the invalid token
      if (error.message.includes('not found') || error.message.includes('invalid')) {
        removeCartToken();
      }
      throw error;
    }
  }

  // Add item to cart
  async addToCart(variantId, quantity = 1) {
    cartLogger.operationStart('CartManager', 'addToCart', { variantId, quantity });
    
    await this.ensureInitialized();
    
    // Ensure we have a cart
    await this.getOrCreateCart();
    const cartToken = getCartToken();

    if (!cartToken) {
      const error = new Error('No cart available after getOrCreateCart');
      cartLogger.error('CartManager', 'Critical error: No cart token available', error);
      throw error;
    }

    const ADD_TO_CART_MUTATION = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Convert variant ID to proper format if needed
    const variantIdString = String(variantId || '');
    const formattedVariantId = variantIdString.startsWith('gid://') ? variantIdString : `gid://shopify/ProductVariant/${variantIdString}`;
    
    cartLogger.debug('CartManager', 'Variant ID conversion', {
      originalVariantId: variantId,
      variantIdType: typeof variantId,
      variantIdString: variantIdString,
      formattedVariantId: formattedVariantId
    });

    const variables = {
      cartId: cartToken,
      lines: [{
        merchandiseId: formattedVariantId,
        quantity: quantity
      }]
    };

    try {
      cartLogger.info('CartManager', 'Adding item to cart', {
        variantId: formattedVariantId,
        quantity: quantity,
        cartToken: cartToken?.substring(0, 20) + '...'
      });
      
      cartLogger.apiCall('CartManager', 'POST', 'cartLinesAdd mutation', variables);
      
      const startTime = Date.now();
      const data = await shopifyFetch({ query: ADD_TO_CART_MUTATION, variables });
      const duration = Date.now() - startTime;
      
      cartLogger.apiResponse('CartManager', 'POST', 'cartLinesAdd', { ok: true }, duration);
      
      if (data.cartLinesAdd.userErrors.length > 0) {
        const errorMessage = data.cartLinesAdd.userErrors.map(e => e.message).join(', ');
        cartLogger.error('CartManager', 'Add to cart failed with user errors', null, {
          userErrors: data.cartLinesAdd.userErrors,
          variantId: formattedVariantId,
          quantity: quantity
        });
        throw new Error(`Add to cart failed: ${errorMessage}`);
      }

      const previousQuantity = this.cartData?.totalQuantity || 0;
      this.cartData = data.cartLinesAdd.cart;
      updateLastSyncTime();
      
      cartLogger.stateChange('CartManager', 
        `${previousQuantity} items`, 
        `${this.cartData.totalQuantity} items`, 
        'Item added to cart'
      );
      
      cartLogger.operationSuccess('CartManager', 'addToCart', {
        previousQuantity: previousQuantity,
        newQuantity: this.cartData.totalQuantity,
        itemsAdded: quantity,
        totalAmount: this.cartData.cost?.totalAmount?.amount
      });
      
      // Trigger sync after cart update (import dynamically to avoid circular dependency)
      setTimeout(async () => {
        try {
          cartLogger.debug('CartManager', 'Triggering post-add sync');
          
          // Use iframe sync to avoid CORS issues
          const { directCartSync } = await import('./directCartSync');
          await directCartSync.syncViaIframe();
          
          // Also trigger regular sync service
          const { cartSyncService } = await import('./cartSync');
          await cartSyncService.syncAfterCartUpdate();
        } catch (error) {
          cartLogger.warn('CartManager', 'Post-add sync failed', error);
        }
      }, 1000);
      
      return this.cartData;
    } catch (error) {
      cartLogger.operationFailure('CartManager', 'addToCart', error, {
        variantId: formattedVariantId,
        quantity: quantity
      });
      throw error;
    }
  }

  // Update cart item quantity
  async updateCartItem(lineId, quantity) {
    const cartToken = getCartToken();
    if (!cartToken) {
      throw new Error('No cart available');
    }

    const UPDATE_CART_MUTATION = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId: cartToken,
      lines: [{
        id: lineId,
        quantity: quantity
      }]
    };

    try {
      console.log('[CartManager] Updating cart item:', { lineId, quantity });
      const data = await shopifyFetch({ query: UPDATE_CART_MUTATION, variables });
      
      if (data.cartLinesUpdate.userErrors.length > 0) {
        throw new Error(`Update cart failed: ${data.cartLinesUpdate.userErrors.map(e => e.message).join(', ')}`);
      }

      this.cartData = data.cartLinesUpdate.cart;
      updateLastSyncTime();
      return this.cartData;
    } catch (error) {
      console.error('[CartManager] Failed to update cart item:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(lineId) {
    const cartToken = getCartToken();
    if (!cartToken) {
      throw new Error('No cart available');
    }

    const REMOVE_FROM_CART_MUTATION = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            totalQuantity
            cost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        title
                        handle
                      }
                      image {
                        url
                        altText
                      }
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId: cartToken,
      lineIds: [lineId]
    };

    try {
      console.log('[CartManager] Removing from cart:', lineId);
      const data = await shopifyFetch({ query: REMOVE_FROM_CART_MUTATION, variables });
      
      if (data.cartLinesRemove.userErrors.length > 0) {
        throw new Error(`Remove from cart failed: ${data.cartLinesRemove.userErrors.map(e => e.message).join(', ')}`);
      }

      this.cartData = data.cartLinesRemove.cart;
      updateLastSyncTime();
      return this.cartData;
    } catch (error) {
      console.error('[CartManager] Failed to remove from cart:', error);
      throw error;
    }
  }

  // Get checkout URL for the current cart
  getCheckoutUrl() {
    return this.cartData?.checkoutUrl || null;
  }

  // Sync with Shopify cart session (for cross-domain continuity)
  async syncWithShopifyCart() {
    console.log('[CartManager] Syncing with Shopify cart...');
    
    try {
      const syncResult = await syncWithExistingSession();
      
      if (syncResult.synced && syncResult.token !== getCartToken()) {
        console.log('[CartManager] Cart token updated from sync');
        this.cartToken = syncResult.token;
        this.cartData = null; // Clear cached data to force refresh
      }
      
      return syncResult;
    } catch (error) {
      console.error('[CartManager] Failed to sync with Shopify cart:', error);
      throw error;
    }
  }

  // Ensure cart continuity across domains
  async ensureCartContinuity() {
    await this.ensureInitialized();
    
    try {
      // Check if we need to sync with existing session
      const currentToken = getCartToken();
      if (!currentToken) {
        await this.syncWithShopifyCart();
      }
      
      // Validate current session
      if (currentToken && !await validateCartSession(currentToken)) {
        console.log('[CartManager] Current session invalid, resyncing...');
        await this.syncWithShopifyCart();
      }
      
      return true;
    } catch (error) {
      console.error('[CartManager] Failed to ensure cart continuity:', error);
      return false;
    }
  }

  // Get cart summary for UI display
  getCartSummary() {
    if (!this.cartData) {
      return {
        totalQuantity: 0,
        totalAmount: '0.00',
        currencyCode: 'USD',
        items: []
      };
    }

    return {
      totalQuantity: this.cartData.totalQuantity || 0,
      totalAmount: this.cartData.cost?.totalAmount?.amount || '0.00',
      currencyCode: this.cartData.cost?.totalAmount?.currencyCode || 'USD',
      items: this.cartData.lines?.edges?.map(edge => edge.node) || []
    };
  }
}

// Export singleton instance
export const cartManager = new CartManager();
export default cartManager;