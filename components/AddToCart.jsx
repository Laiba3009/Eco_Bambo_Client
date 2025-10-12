// components/AddToCart.jsx
"use client";
import React, { useState } from "react";
import {
  FaMinus, FaPlus, FaTimes, FaShoppingCart, FaShoppingBag
} from "react-icons/fa";

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ecobambo.com";
const CART_KEY = "shopify_cart_token";

function toNumericVariantId(id) {
  if (!id) return null;
  if (typeof id === "number") return String(id);
  if (/^gid:\/\//.test(id)) {
    const parts = id.split("/");
    return parts[parts.length - 1];
  }
  return String(id);
}

// --- CART LOGIC ---

// Save cart token in local storage
function saveCartToken(token) {
  try { localStorage.setItem(CART_KEY, token); } catch {}
}
function getCartToken() {
  try { return localStorage.getItem(CART_KEY); } catch { return null; }
}

// Ensure a persistent Shopify cart exists
async function ensureCart() {
  // If local cart already exists, return
  const existing = getCartToken();
  if (existing) return existing;

  // Check Shopify if any active cart exists
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/cart.js`, {
    credentials: "include",
  });
  const cart = await res.json().catch(() => null);
  if (cart?.token) {
    saveCartToken(cart.token);
    return cart.token;
  }

  // Create new empty cart
  const create = await fetch(`https://${SHOPIFY_DOMAIN}/cart/create.js`, {
    method: "POST",
    credentials: "include",
  });
  const newCart = await create.json().catch(() => null);
  if (newCart?.token) {
    saveCartToken(newCart.token);
    return newCart.token;
  }

  throw new Error("Unable to ensure a persistent Shopify cart");
}

// Add item to cart using persistent cart
async function addToCart(variantId, quantity = 1) {
  await ensureCart();

  const formData = new URLSearchParams();
  formData.append("id", variantId);
  formData.append("quantity", quantity);

  const res = await fetch(`https://${SHOPIFY_DOMAIN}/cart/add.js`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!res.ok) throw new Error("Failed to add to cart");
  const data = await res.json();
  console.log("✅ Added to Shopify cart:", data);
  return data;
}

// --- MAIN COMPONENT ---
const AddToCart = ({ product, selectedVariant }) => {
  const [quantity, setQuantity] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDecrease = () => { if (quantity > 1) setQuantity(q => q - 1); };
  const handleIncrease = () => setQuantity(q => q + 1);

  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.id) {
      alert("Please select a variant first.");
      return;
    }
    setLoading(true);
    try {
      const numericId = toNumericVariantId(selectedVariant.id);
      await addToCart(numericId, quantity);
      setSidebarOpen(true);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = async () => {
    if (!selectedVariant || !selectedVariant.id) {
      alert("Please select a variant first.");
      return;
    }
    setLoading(true);
    try {
      const numericId = toNumericVariantId(selectedVariant.id);
      await addToCart(numericId, quantity);
      window.open(`https://${SHOPIFY_DOMAIN}/cart`, "_blank");
    } catch (err) {
      console.error("Order now failed:", err);
      alert(err.message);
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
            <button onClick={handleDecrease} className="bg-white text-black p-2 rounded hover:bg-gray-300">
              <FaMinus size={14} />
            </button>
            <span className="text-lg text-black">{quantity}</span>
            <button onClick={handleIncrease} className="bg-white text-black p-2 rounded hover:bg-gray-300">
              <FaPlus size={14} />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="bg-black text-[rgb(184,134,11,1)] py-3 px-4 rounded flex items-center justify-center gap-2 w-full"
          >
            <FaShoppingCart />
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          <button
            onClick={handleOrderNow}
            disabled={loading}
            className="border border-[rgb(184,134,11,1)] bg-black text-[rgb(184,134,11,1)] py-4 px-6 rounded flex items-center justify-center gap-2 w-full"
          >
            <FaShoppingBag />
            {loading ? "Processing..." : "Order Now"}
          </button>
        </div>
      </div>

      {/* Sidebar */}
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
              {product?.title || "Your Cart"}
            </h2>
            <p className="text-sm text-black">
              Item added to cart!{" "}
              <a
                href={`https://${SHOPIFY_DOMAIN}/cart`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                View cart
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCart;
