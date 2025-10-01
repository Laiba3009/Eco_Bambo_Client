import React from "react";
import { useCart } from "../context/CartContext";

type CartItem = {
  variantId: string;
  quantity: number;
};

const CheckoutButton = () => {
  const { cart } = useCart() as { cart: CartItem[] };

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Build cart URL
    const cartString = cart
      .map((item) => `${item.variantId}:${item.quantity}`)
      .join(",");

    const checkoutUrl = `https://ecobambo.com/cart/${cartString}`;
    window.location.href = checkoutUrl;
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
