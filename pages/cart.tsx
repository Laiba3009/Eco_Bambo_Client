import React from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";

export default function CartPage() {
  const cartContext = useCart();
  const router = useRouter();

  if (!cartContext) {
    return <div className="p-10 text-center">🛒 Cart is unavailable</div>;
  }

  const { cart, removeFromCart } = cartContext;

  const handleCheckout = async () => {
    const lineItems = cart.map((item: any) => ({
      variantId: item.variantId,
      quantity: item.quantity
    }));

    const res = await fetch("/api/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineItems }),
    });

    const data = await res.json();
    if (data.checkoutUrl) {
      router.push(data.checkoutUrl); // Shopify checkout open
    }
  };

  if (cart.length === 0) return <div className="p-10 text-center">🛒 Cart is empty</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.map((item, index) => (
        <div key={index} className="flex justify-between items-center border-b py-3">
          <div>
            <p className="font-semibold">{item.product.title}</p>
            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
          </div>
          <button
            onClick={() => removeFromCart(item.variantId)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={handleCheckout}
        className="mt-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
