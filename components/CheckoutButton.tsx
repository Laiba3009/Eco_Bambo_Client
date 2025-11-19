import React from "react";
import { useCart } from "../context/CartContext";

const CheckoutButton = () => {
  // FIX → Proper type define so TS never complains
  const cartContext = useCart() as {
    cart: any[];
    getCheckoutUrl: () => string | null;
  };

  const handleCheckout = () => {
    if (!cartContext || !cartContext.cart || cartContext.cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const checkoutUrl = cartContext.getCheckoutUrl();

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
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
    </div>
  );
};

export default CheckoutButton;
