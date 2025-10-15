import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import cartManager from "../lib/cartManager";
import cartPersistenceManager from "../lib/cartPersistence";

// Updated types to match Shopify Cart API structure
type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
    };
    image?: {
      url: string;
      altText?: string;
    };
    priceV2: {
      amount: string;
      currencyCode: string;
    };
  };
};

type CartSummary = {
  totalQuantity: number;
  totalAmount: string;
  currencyCode: string;
  items: CartLine[];
};

type CartContextType = {
  cart: CartLine[];
  cartSummary: CartSummary;
  loading: boolean;
  error: string | null;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateCartItem: (lineId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
  clearError: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    totalQuantity: 0,
    totalAmount: '0.00',
    currencyCode: 'USD',
    items: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize cart manager and persistence
  useEffect(() => {
    const initializeCart = async () => {
      try {
        setLoading(true);
        console.log('[CartContext] Initializing cart with persistence...');
        
        // Initialize cart persistence (this will also initialize cart manager)
        const persistenceResult = await cartPersistenceManager.initializePersistence();
        
        // Initialize cart manager if not already done
        if (!cartManager.initialized) {
          await cartManager.initialize();
        }
        
        // Load current cart data
        await refreshCartData();
        
        console.log('[CartContext] Cart initialized successfully:', persistenceResult);
      } catch (err) {
        console.error('[CartContext] Failed to initialize cart:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize cart');
      } finally {
        setLoading(false);
      }
    };

    initializeCart();

    // Listen for cross-tab cart updates
    const handleCartUpdate = (event: CustomEvent) => {
      console.log('[CartContext] Cart updated from another tab:', event.detail);
      refreshCartData();
    };

    window.addEventListener('cartUpdated', handleCartUpdate as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate as EventListener);
    };
  }, []);

  // Refresh cart data from CartManager
  const refreshCartData = async () => {
    try {
      const cartData = await cartManager.getCart();
      const summary = cartManager.getCartSummary();
      
      if (cartData && cartData.lines) {
        const items = cartData.lines.edges.map((edge: any) => edge.node);
        setCart(items);
      } else {
        setCart([]);
      }
      
      setCartSummary(summary);
      console.log('[CartContext] Cart data refreshed:', summary);
    } catch (err) {
      console.error('[CartContext] Failed to refresh cart data:', err);
      // Don't set error for refresh failures, just log them
    }
  };

  // Add item to cart using CartManager
  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[CartContext] Adding to cart:', { variantId, quantity });
      
      // Use CartManager to add item
      await cartManager.addToCart(variantId, quantity);
      
      // Refresh cart data
      await refreshCartData();
      
      console.log('[CartContext] Item added successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
      console.error('[CartContext] Add to cart failed:', err);
      setError(errorMessage);
      throw err; // Re-throw so AddToCart component can handle it
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart using CartManager
  const removeFromCart = async (lineId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[CartContext] Removing from cart:', lineId);
      
      // Use CartManager to remove item
      await cartManager.removeFromCart(lineId);
      
      // Refresh cart data
      await refreshCartData();
      
      console.log('[CartContext] Item removed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item from cart';
      console.error('[CartContext] Remove from cart failed:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity using CartManager
  const updateCartItem = async (lineId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('[CartContext] Updating cart item:', { lineId, quantity });
      
      // Use CartManager to update item
      await cartManager.updateCartItem(lineId, quantity);
      
      // Refresh cart data
      await refreshCartData();
      
      console.log('[CartContext] Item updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update cart item';
      console.error('[CartContext] Update cart item failed:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh cart (public method)
  const refreshCart = async () => {
    try {
      setLoading(true);
      await refreshCartData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh cart';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get checkout URL
  const getCheckoutUrl = () => {
    return cartManager.getCheckoutUrl();
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const contextValue: CartContextType = {
    cart,
    cartSummary,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    refreshCart,
    getCheckoutUrl,
    clearError
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
