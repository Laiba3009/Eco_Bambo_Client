// components/AddToCart.jsx
import React, { useState, useEffect } from "react";
import {
  FaMinus, FaPlus, FaTimes, FaShareAlt, FaShoppingCart, FaShoppingBag,
  FaTruck, FaWhatsapp, FaInstagram, FaTiktok, FaFacebookF, FaShieldAlt, FaYoutube
} from "react-icons/fa";
import cartManager from "../lib/cartManager";
import { useCart } from "../context/CartContext";
import cartLogger from "../lib/cartLogger";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ecobambo.com";

/**
 * Convert variant ID to numeric format for compatibility
 */
function toNumericVariantId(id) {
  if (!id) return null;
  if (typeof id === "number") return String(id);
  if (/^gid:\/\//.test(id)) {
    const parts = id.split("/");
    return parts[parts.length - 1];
  }
  return String(id);
}

const AddToCart = ({ product, selectedVariant }) => {
  const [quantity, setQuantity] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDesktopShare, setShowDesktopShare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cartSummary, setCartSummary] = useState({ totalQuantity: 0 });

  // Get cart context for UI updates
  const cartContext = useCart();

  // Initialize cart manager and get current cart state
  useEffect(() => {
    const initializeCart = async () => {
      try {
        cartLogger.debug('AddToCart', 'Initializing cart manager for component', {
          productTitle: product?.title,
          selectedVariant: selectedVariant?.id
        });
        
        await cartManager.initialize();
        const summary = cartManager.getCartSummary();
        setCartSummary(summary);
        
        cartLogger.info('AddToCart', 'Cart manager initialized successfully', {
          cartTotal: summary.totalQuantity,
          totalAmount: summary.totalAmount
        });
      } catch (error) {
        cartLogger.error('AddToCart', 'Failed to initialize cart manager', error, {
          productTitle: product?.title
        });
      }
    };

    initializeCart();
  }, []);

  const handleDecrease = () => { 
    if (quantity > 1) setQuantity(q => q - 1); 
  };
  
  const handleIncrease = () => setQuantity(q => q + 1);

  const handleAddToCart = async () => {
    cartLogger.operationStart('AddToCart', 'handleAddToCart', {
      productTitle: product?.title,
      variantId: selectedVariant?.id,
      quantity: quantity
    });

    if (!selectedVariant || !selectedVariant.id) {
      const errorMsg = "Please select a variant first.";
      cartLogger.warn('AddToCart', 'Add to cart attempted without variant selection', null, {
        productTitle: product?.title,
        hasSelectedVariant: !!selectedVariant
      });
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      cartLogger.info('AddToCart', 'Starting add to cart process', {
        variantId: selectedVariant.id,
        quantity: quantity,
        productTitle: product?.title
      });

      // Use CartManager instead of form submission
      const numericId = toNumericVariantId(selectedVariant.id);
      
      cartLogger.debug('AddToCart', 'Converted variant ID', {
        originalId: selectedVariant.id,
        numericId: numericId
      });

      const updatedCart = await cartManager.addToCart(numericId, quantity);
      
      // Update local cart summary
      const summary = cartManager.getCartSummary();
      setCartSummary(summary);
      
      cartLogger.info('AddToCart', 'Cart summary updated', {
        previousTotal: cartSummary.totalQuantity,
        newTotal: summary.totalQuantity,
        itemsAdded: quantity
      });
      
      // Update cart context if available
      if (cartContext && cartContext.addToCart) {
        cartLogger.debug('AddToCart', 'Updating cart context');
        cartContext.addToCart(product, selectedVariant.id, quantity);
      } else {
        cartLogger.warn('AddToCart', 'Cart context not available for update');
      }

      setSuccess(true);
      setSidebarOpen(true);
      
      cartLogger.operationSuccess('AddToCart', 'handleAddToCart', {
        cartTotal: summary.totalQuantity,
        itemsInCart: summary.items.length,
        totalAmount: summary.totalAmount,
        currencyCode: summary.currencyCode
      });

    } catch (err) {
      const errorMessage = err.message || 'Failed to add item to cart. Please try again.';
      cartLogger.operationFailure('AddToCart', 'handleAddToCart', err, {
        variantId: selectedVariant.id,
        quantity: quantity,
        productTitle: product?.title
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = async () => {
    cartLogger.operationStart('AddToCart', 'handleOrderNow', {
      productTitle: product?.title,
      variantId: selectedVariant?.id,
      quantity: quantity
    });

    if (!selectedVariant || !selectedVariant.id) {
      const errorMsg = "Please select a variant first.";
      cartLogger.warn('AddToCart', 'Order now attempted without variant selection');
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      cartLogger.info('AddToCart', 'Starting order now process');
      
      // First add to cart
      const numericId = toNumericVariantId(selectedVariant.id);
      await cartManager.addToCart(numericId, quantity);
      
      // Get checkout URL from cart manager
      const checkoutUrl = cartManager.getCheckoutUrl();
      
      cartLogger.debug('AddToCart', 'Retrieved checkout URL', {
        hasCheckoutUrl: !!checkoutUrl,
        checkoutUrlPreview: checkoutUrl?.substring(0, 50) + '...'
      });
      
      if (checkoutUrl) {
        cartLogger.info('AddToCart', 'Redirecting to Shopify checkout', {
          checkoutUrl: checkoutUrl
        });
        window.open(checkoutUrl, '_blank');
      } else {
        cartLogger.warn('AddToCart', 'No checkout URL available, using fallback cart page');
        window.open(`https://${SHOPIFY_DOMAIN}/cart`, '_blank');
      }

      cartLogger.operationSuccess('AddToCart', 'handleOrderNow', {
        redirectMethod: checkoutUrl ? 'checkout' : 'cart_fallback'
      });

    } catch (err) {
      const errorMessage = err.message || 'Failed to process order. Please try again.';
      cartLogger.operationFailure('AddToCart', 'handleOrderNow', err, {
        variantId: selectedVariant.id,
        quantity: quantity
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 mt-4">
        {/* Quantity */}
        <div>
          <label className="font-albert text-black text-lg mb-2 block">Quantity</label>
          <div className="flex items-center gap-4">
            <button onClick={handleDecrease} className="bg-white text-black p-2 rounded hover:bg-gray-300"><FaMinus size={14} /></button>
            <span className="text-lg text-black">{quantity}</span>
            <button onClick={handleIncrease} className="bg-white text-black p-2 rounded hover:bg-gray-300"><FaPlus size={14} /></button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && !sidebarOpen && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            <p className="text-sm">✅ Item added to cart! Cart total: {cartSummary.totalQuantity} items</p>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button 
            onClick={handleAddToCart} 
            disabled={loading || !selectedVariant?.id} 
            className="bg-black text-[rgb(184,134,11,1)] py-3 px-4 rounded flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            <FaShoppingCart />
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          <button 
            onClick={handleOrderNow} 
            disabled={loading || !selectedVariant?.id} 
            className="border border-[rgb(184,134,11,1)] bg-black text-[rgb(184,134,11,1)] py-4 px-6 rounded flex items-center justify-center gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            <FaShoppingBag />
            {loading ? "Processing..." : "Order Now"}
          </button>
        </div>

        {/* Cart Summary Display */}
        {cartSummary.totalQuantity > 0 && (
          <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded">
            <p className="text-sm text-gray-700">
              🛒 Cart: {cartSummary.totalQuantity} items • {cartSummary.currencyCode} {cartSummary.totalAmount}
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[350px] bg-white shadow-xl p-6 z-50">
            <button 
              className="absolute top-4 right-4 text-gray-600 hover:text-black" 
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            
            <h2 className="text-lg text-black font-semibold mb-4">
              ✅ Added to Cart!
            </h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Product:</p>
              <p className="font-medium text-black">{product?.title || "Product"}</p>
              <p className="text-sm text-gray-600">Quantity: {quantity}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded mb-4">
              <p className="text-sm text-gray-700">
                <strong>Cart Total:</strong> {cartSummary.totalQuantity} items
              </p>
              <p className="text-sm text-gray-700">
                <strong>Total Amount:</strong> {cartSummary.currencyCode} {cartSummary.totalAmount}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  window.open(`https://${SHOPIFY_DOMAIN}/cart`, '_blank');
                }}
                className="w-full bg-black text-[rgb(184,134,11,1)] py-2 px-4 rounded hover:bg-gray-800 transition-colors"
              >
                View Cart
              </button>
              
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCart;
