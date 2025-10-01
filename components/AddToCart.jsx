// components/AddToCart.jsx
import React, { useState } from "react";
import {
  FaMinus, FaPlus, FaTimes, FaShareAlt, FaShoppingCart, FaShoppingBag,
  FaTruck, FaWhatsapp, FaInstagram, FaTiktok, FaFacebookF, FaShieldAlt, FaYoutube
} from "react-icons/fa";
import { addToCartApi } from "../lib/cartClient"; // fallback headless option

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "ecobambo.com";

function toNumericVariantId(id) {
  if (!id) return null;
  if (typeof id === "number") return String(id);
  if (/^gid:\/\//.test(id)) {
    const parts = id.split("/");
    return parts[parts.length - 1];
  }
  return String(id);
}

/** Submit a POST form to the shop in a new tab to add to the theme cart.
 *  Uses /cart/add (form) which updates shop cookies and cart for that browser.
 */
function submitToShopInNewTab(numericVariantId, quantity = 1) {
  // create form
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `https://${SHOPIFY_DOMAIN}/cart/add`;
  form.target = "_blank"; // open new tab so user stays on your frontend
  form.style.display = "none";

  // Option A: use items array (works for multiple items)
  const itemsInput = document.createElement("input");
  itemsInput.type = "hidden";
  itemsInput.name = "items[][id]"; // some shops accept items[][id] & items[][quantity]
  itemsInput.value = numericVariantId;
  form.appendChild(itemsInput);

  const qtyInput = document.createElement("input");
  qtyInput.type = "hidden";
  qtyInput.name = "items[][quantity]";
  qtyInput.value = String(quantity);
  form.appendChild(qtyInput);

  // fallback: also include single id and quantity (some themes accept this)
  const idInput = document.createElement("input");
  idInput.type = "hidden";
  idInput.name = "id";
  idInput.value = numericVariantId;
  form.appendChild(idInput);

  const qInput2 = document.createElement("input");
  qInput2.type = "hidden";
  qInput2.name = "quantity";
  qInput2.value = String(quantity);
  form.appendChild(qInput2);

  document.body.appendChild(form);
  form.submit(); // open new tab and submit
  setTimeout(() => {
    try { document.body.removeChild(form); } catch(e) {}
  }, 1000);
}

async function addToThemeCartFetch(numericVariantId, quantity = 1) {
  const url = `https://${SHOPIFY_DOMAIN}/cart/add.js`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({ items: [{ id: Number(numericVariantId), quantity: Number(quantity) }] }),
    });
    const text = await resp.text();
    try {
      const json = text ? JSON.parse(text) : null;
      if (!resp.ok) {
        return { success: false, error: json?.description || json?.message || `HTTP ${resp.status}`, response: json };
      }
      return { success: true, response: json };
    } catch (parseErr) {
      return { success: false, error: "Non-JSON response from shop", responseText: text };
    }
  } catch (err) {
    return { success: false, error: err.message || String(err) };
  }
}

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
      // 1) Try client-side fetch to theme cart (works only if same-origin or shop allows CORS)
      const themeTry = await addToThemeCartFetch(numericId, quantity);
      if (themeTry.success) {
        setSidebarOpen(true);
        console.log("Added to theme cart via fetch:", themeTry.response);
        alert("Item added to store cart (theme). Open the store cart to view items.");
        setLoading(false);
        return;
      }

      // 2) If fetch failed due to CORS or other, fallback to opening shop add in a new tab
      console.warn("Theme fetch failed; falling back to form submission in new tab:", themeTry.error);
      // Open new tab and add to shop cart (this will update shop cookies so cart is visible site-wide)
      submitToShopInNewTab(numericId, quantity);
      alert("A new tab will open showing your store cart. The item has been added there.");

      // 3) Optional: also call headless fallback (Storefront API) so headless cart is updated too
      // This is optional; uncomment if you want both stores updated.
      // try { await addToCartApi(selectedVariant.id, quantity); } catch(e){ console.warn("Headless fallback failed", e); }

    } catch (err) {
      console.error("Add to cart unexpected error:", err);
      alert("Add to cart failed: " + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleOrderNow = async () => {
    // Just add to theme cart then open shop cart page for user (without auto-checkout)
    if (!selectedVariant || !selectedVariant.id) {
      alert("Please select a variant first.");
      return;
    }
    setLoading(true);
    try {
      const numericId = toNumericVariantId(selectedVariant.id);
      // Use form submit in new tab then open cart in that tab — submitToShopInNewTab already opens the tab to shop cart after adding.
      submitToShopInNewTab(numericId, quantity);
      // Optionally also call headless fallback for consistency
      // await addToCartApi(selectedVariant.id, quantity);
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

        {/* rest UI - omitted here for brevity (keep your existing UI if needed) */}
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[350px] bg-white shadow-xl p-6 z-50">
            <button className="absolute top-4 right-4" onClick={() => setSidebarOpen(false)}><FaTimes /></button>
            <h2 className="text-lg font-semibold mb-4">{product?.title || "Cart"}</h2>
            <p>Item added to cart. <a href={`https://${SHOPIFY_DOMAIN}/cart`} target="_blank" rel="noreferrer" className="underline">Open store cart</a></p>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCart;
