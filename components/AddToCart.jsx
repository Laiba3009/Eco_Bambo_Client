import React, { useState } from "react";
import {
  FaMinus,
  FaPlus,
  FaTimes,
  FaShareAlt,
  FaShoppingCart,
  FaShoppingBag,
  FaTruck,
  FaWhatsapp,
  FaInstagram,
  FaTiktok,
  FaFacebookF,
  FaShieldAlt,
  FaYoutube,
} from "react-icons/fa";

const AddToCart = ({ product, selectedVariant }) => {
  const [quantity, setQuantity] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showDesktopShare, setShowDesktopShare] = useState(false);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select a variant first");
      return;
    }

    if (!selectedVariant.id) {
      alert("Variant information is missing. Please try refreshing the page.");
      return;
    }

    try {
      // Shopify variant ID extract karna
      const shopifyVariantId = selectedVariant.id.split("/").pop();
      if (!shopifyVariantId) {
        alert("Invalid variant ID. Please try refreshing the page.");
        return;
      }

      // ✅ Shopify cart page with product
      const cartUrl = `https://ecobambo.com/cart/${shopifyVariantId}:${quantity}`;

      // Redirect to Shopify cart page
      window.location.href = cartUrl;
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart. Please try again.");
    }
  };

  const handleOrderNow = handleAddToCart;

  return (
    <>
      <div className="space-y-6 mt-4">
        {/* Quantity Selector */}
        <div>
          <label className="font-albert text-black text-lg mb-2 block">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDecrease}
              className="bg-white text-black font-albert p-2 rounded hover:bg-gray-300"
            >
              <FaMinus size={14} />
            </button>
            <span className="text-lg text-black font-albert">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="bg-white text-black font-albert p-2 rounded hover:bg-gray-300"
            >
              <FaPlus size={14} />
            </button>
          </div>
        </div>

        {/* Add to Cart & Order Now Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={handleAddToCart}
            className="bg-black text-[rgb(184,134,11,1)] py-3 px-4 hover:text-white rounded flex items-center justify-center gap-2 w-full transition-transform duration-200 hover:scale-105"
          >
            <FaShoppingCart />
            Add to Cart
          </button>

          <button
            onClick={handleOrderNow}
            className="border border-[rgb(184,134,11,1)] bg-black hover:text-white text-[rgb(184,134,11,1)] py-4 px-6 rounded flex items-center justify-center gap-2 w-full animate-bounce text-lg font-bold shadow-lg"
          >
            <FaShoppingBag />
            Order Now
          </button>
        </div>

        {/* Pickup Info */}
        <div className="text-sm text-black flex items-start gap-2">
          <span className="text-green-600 text-lg">✔</span>
          <div>
            <p>
              <strong>Pickup available at Eco Bamboo.</strong>
              <br />
              Usually ready in 24 hours
            </p>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-black underline mt-1 inline-block"
            >
              View store information
            </button>
          </div>
        </div>

        {/* Delivery & Return + Share Button */}
        <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
          <button
            onClick={() => setPolicyOpen(true)}
            className="text-black font-semibold underline text-sm flex items-center gap-2"
          >
            <FaTruck />
            Delivery & Return
          </button>

          {/* Share Button and Social Icons */}
          <div className="relative group">
            <button
              onClick={() => setShowShare(!showShare)}
              onMouseEnter={() => setShowDesktopShare(true)}
              onMouseLeave={() => setShowDesktopShare(false)}
              className="flex items-center gap-2 p-2 text-black rounded-full hover:bg-gray-300"
            >
              <FaShareAlt />
              {/* Social Icons: Mobile */}
              <span className="flex gap-1 lg:hidden ml-1">
                <a
                  href="https://www.facebook.com/share/1EVwQs5T9X/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-black hover:text-[#B8860B]"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://www.instagram.com/ecobambo0?igsh=a3dpZ3NiY2R6d3Uw&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-black hover:text-[#B8860B]"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.tiktok.com/@ecobambo0?_t=ZS-8uYnW51R4Sb&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="text-black hover:text-[#B8860B]"
                >
                  <FaTiktok />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCMEfaztIY2KxW6fFh_J8zmw"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-black hover:text-[#B8860B]"
                >
                  <FaYoutube />
                </a>
                <a
                  href="https://wa.me/923416995870"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-black hover:text-[#B8860B]"
                >
                  <FaWhatsapp />
                </a>
              </span>
              <span>Share</span>
            </button>

            {/* Desktop: Social Icons */}
            <div
              className={`hidden lg:flex gap-2 mt-2 items-center flex-row transition-opacity duration-200 ${
                showDesktopShare || showShare
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
              onMouseEnter={() => setShowDesktopShare(true)}
              onMouseLeave={() => setShowDesktopShare(false)}
            >
              <a
                href="https://www.facebook.com/share/1EVwQs5T9X/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-black hover:text-[#B8860B]"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/ecobambo0?igsh=a3dpZ3NiY2R6d3Uw&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-black hover:text-[#B8860B]"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.tiktok.com/@ecobambo0?_t=ZS-8uYnW51R4Sb&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-black hover:text-[#B8860B]"
              >
                <FaTiktok />
              </a>
              <a
                href="https://www.youtube.com/channel/UCMEfaztIY2KxW6fFh_J8zmw"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-black hover:text-[#B8860B]"
              >
                <FaYoutube />
              </a>
              <a
                href="https://wa.me/923416995870"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-black hover:text-[#B8860B]"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>

        {/* Guarantee Safe Checkout */}
        <div className="flex flex-wrap items-center justify-between rounded-md px-4 py-3 mt-4 ">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-lg">
              <FaShieldAlt />
            </span>
            <span className="text-sm font-medium text-gray-800">
              Guarantee Safe Checkout
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            {[1, 2, 3, 4, 5].map((n) => (
              <img
                key={n}
                src={`/images/cash${n}.png`}
                alt={`cash${n}`}
                className="w-8 h-6 object-contain"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar for Store Info */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-[350px] bg-white shadow-xl p-6 z-50">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-lg text-black font-semibold mb-4">
              {product.title}
            </h2>
            <p className="mb-2 text-black text-sm">
              <strong>Color:</strong> {selectedVariant.color}
            </p>
            <h3 className="font-semibold text-black mb-2">Eco Bamboo</h3>
            <p className="text-sm text-black mb-1">
              Pickup available, usually ready in 24 hours
            </p>
            <p className="text-sm leading-relaxed text-black">
              Eco Bamboo
              <br />
              Karkhane wali abadi, Near PSO Pump Petrol,
              <br />
              Nazd Ali Niaz Sweet, Chakian, Phularwan
              <br />
              Bhalwal 40410
              <br />
              Pakistan
              <br />
              <br />
              <strong>Phone:</strong> +92 347 8237147
            </p>
          </div>
        </div>
      )}

      {/* Delivery & Return Modal */}
      {policyOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center px-4">
          <div className="relative bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-black"
              onClick={() => setPolicyOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl text-black font-albert font-bold mb-4">
              Returns & Exchanges Policy
            </h2>
            <p className="text-sm text-black font-jost leading-relaxed whitespace-pre-wrap">
              {/* Aapka pura return policy text yaha rahega */}
              At Eco Bamboo, we are committed to providing high-quality,
              eco-friendly products. If you are not satisfied with your
              purchase, you can request a return or refund based on the
              conditions outlined below...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToCart;
