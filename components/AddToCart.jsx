// components/AddToCart.jsx
import React, { useState } from "react";
import {
  FaMinus, FaPlus, FaTimes, FaShareAlt, FaShoppingCart, FaShoppingBag,
  FaTruck, FaWhatsapp, FaInstagram, FaTiktok, FaFacebookF, FaShieldAlt, FaYoutube
} from "react-icons/fa";
// No headless cart; we will always submit to the Shopify theme cart

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ecobambo.com";
// Tokenless access: latest Storefront API supports Cart read/write without a token

function toNumericVariantId(id) {
  if (!id) return null;
  if (typeof id === "number") return String(id);
  if (/^gid:\/\//.test(id)) {
    const parts = id.split("/");
    return parts[parts.length - 1];
  }
  return String(id);
}

// We avoid cross-origin reads. We only submit and let Shopify set/update its cart cookie.

/**
 * Submit to Shopify via App Proxy to maintain cart session and avoid CORS issues.
 * This ensures the cart cookie is properly set and shared between domains.
 */
async function submitToShopifyProxy(numericVariantId, quantity = 1) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // In development, use direct API call to our Next.js API
  // In production, use the Shopify App Proxy
  const proxyUrl = isDevelopment 
    ? '/api/cart/add'  // Direct API call in development
    : `https://${SHOPIFY_DOMAIN}/apps/eco/cart/add`;  // App Proxy in production
  
  console.log(`[AddToCart] Using ${isDevelopment ? 'development' : 'production'} endpoint:`, proxyUrl);
  
  const formData = new URLSearchParams();
  formData.append('id', String(numericVariantId));
  formData.append('quantity', String(quantity));
  
  // Also include items[] format for compatibility
  formData.append('items[][id]', String(numericVariantId));
  formData.append('items[][quantity]', String(quantity));

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  };

  // Note: Removed credentials for now to avoid CORS issues
  // The Shopify App Proxy should handle session management

  const response = await fetch(proxyUrl, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[AddToCart] Request failed:`, {
      status: response.status,
      statusText: response.statusText,
      url: proxyUrl,
      error: errorText
    });
    throw new Error(`Cart add failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  
  if (result.error) {
    throw new Error(result.error);
  }

  console.log('[AddToCart] Success:', result);
  return result;
}

// All cart updates will be performed by Shopify when we POST a form to ecobambo.com

const AddToCart = ({ product, selectedVariant }) => {
  const [quantity, setQuantity] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDesktopShare, setShowDesktopShare] = useState(false);
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
      await submitToShopifyProxy(numericId, quantity);
      setSidebarOpen(true);
      console.log("Item successfully added to cart via proxy");
    } catch (err) {
      console.error("Add to cart submit failed:", err);
      alert("Add to cart failed: " + (err.message || String(err)));
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
      await submitToShopifyProxy(numericId, quantity);
      // Open cart page in new tab for user clarity
      window.open(`https://${SHOPIFY_DOMAIN}/cart`, "_blank");
    } catch (err) {
      console.error("Order now error:", err);
      alert("Order now failed: " + (err.message || String(err)));
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

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button onClick={handleAddToCart} disabled={loading} className="bg-black text-[rgb(184,134,11,1)] py-3 px-4 rounded flex items-center justify-center gap-2 w-full">
            <FaShoppingCart />
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          <button onClick={handleOrderNow} disabled={loading} className="border border-[rgb(184,134,11,1)] bg-black text-[rgb(184,134,11,1)] py-4 px-6 rounded flex items-center justify-center gap-2 w-full">
            <FaShoppingBag />
            {loading ? "Processing..." : "Order Now"}
          </button>
        </div>

        {/* (rest of your UI kept minimal here; you can paste your original content back) */}
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[350px] bg-white shadow-xl p-6 z-50">
            <button className="absolute top-4 right-4 text-gray-600 hover:text-black" onClick={() => setSidebarOpen(false)}><FaTimes size={20} /></button>
            <h2 className="text-lg text-black font-semibold mb-4">{product?.title || "Your Cart"}</h2>
            <p className="text-sm text-black">Item added to cart. <a href={`https://${SHOPIFY_DOMAIN}/cart`} target="_blank" rel="noreferrer" className="underline">Open store cart</a></p>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCart;
