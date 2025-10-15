import React from "react";
import { useCart } from "../context/CartContext";

const CheckoutButton = () => {
  const cartContext = useCart();

  const handleCheckout = () => {
    if (!cartContext || !cartContext.cart || cartContext.cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Use the checkout URL from cart manager if available
    const checkoutUrl = cartContext.getCheckoutUrl();
    
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      // Fallback to cart page
      window.location.href = "https://ecobambo.com/cart";
    }
  };

  return (
    <div>
    <button
      onClick={handleCheckout}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Checkout
    </button>
    </div>);
};

export default CheckoutButton;
