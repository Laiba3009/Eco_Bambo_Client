import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";
import { FaMinus, FaPlus, FaTrash, FaSpinner } from "react-icons/fa";

export default function CartPage() {
  const cartContext = useCart();
  const router = useRouter();
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  if (!cartContext) {
    return <div className="p-10 text-center">🛒 Cart is unavailable</div>;
  }

  const { 
    cart, 
    cartSummary, 
    loading, 
    error, 
    removeFromCart, 
    updateCartItem, 
    getCheckoutUrl,
    clearError 
  } = cartContext;

  const handleRemoveItem = async (lineId: string) => {
    try {
      setProcessingItems(prev => new Set(prev).add(lineId));
      await removeFromCart(lineId);
    } catch (err) {
      console.error('Failed to remove item:', err);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(lineId);
        return newSet;
      });
    }
  };

  const handleUpdateQuantity = async (lineId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setProcessingItems(prev => new Set(prev).add(lineId));
      await updateCartItem(lineId, newQuantity);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(lineId);
        return newSet;
      });
    }
  };

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
    } else {
      // Fallback to Shopify cart page
      window.open(`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/cart`, '_blank');
    }
  };

  if (loading && cart.length === 0) {
    return (
      <div className="p-10 text-center">
        <FaSpinner className="animate-spin mx-auto mb-4 text-2xl" />
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="bg-gray-50 rounded-lg p-8">
          <p className="text-gray-600 mb-4">🛒 Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex justify-between items-center">
            <p>{error}</p>
            <button onClick={clearError} className="text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.map((item) => {
          const isProcessing = processingItems.has(item.id);
          
          return (
            <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                {item.merchandise.image && (
                  <img
                    src={item.merchandise.image.url}
                    alt={item.merchandise.image.altText || item.merchandise.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                
                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.merchandise.product.title}</h3>
                  <p className="text-gray-600">{item.merchandise.title}</p>
                  <p className="text-lg font-bold text-green-600">
                    {item.merchandise.priceV2.currencyCode} {item.merchandise.priceV2.amount}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={isProcessing || item.quantity <= 1}
                    className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    <FaMinus size={12} />
                  </button>
                  
                  <span className="px-4 py-2 bg-gray-100 rounded min-w-[3rem] text-center">
                    {isProcessing ? <FaSpinner className="animate-spin mx-auto" size={12} /> : item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={isProcessing}
                    className="bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isProcessing}
                  className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                  title="Remove item"
                >
                  {isProcessing ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total Items:</span>
          <span className="text-lg">{cartSummary.totalQuantity}</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Total Amount:</span>
          <span className="text-xl font-bold text-green-600">
            {cartSummary.currencyCode} {cartSummary.totalAmount}
          </span>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-semibold"
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
