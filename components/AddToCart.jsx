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

const SHOPIFY_DOMAIN = "ecobambo.com";

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
      alert('Please select a variant first');
      return;
    }
    
    if (!selectedVariant.id) {
      alert('Variant information is missing. Please try refreshing the page.');
      return;
    }
    
    try {
      // Shopify variant ID is the last part after 'gid://shopify/ProductVariant/'
      const shopifyVariantId = selectedVariant.id.split('/').pop();
      if (!shopifyVariantId) {
        alert('Invalid variant ID. Please try refreshing the page.');
        return;
      }
      const cartUrl = `https://${SHOPIFY_DOMAIN}/cart/${shopifyVariantId}:${quantity}`;
      window.location.href = cartUrl;
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    }
  };

  const handleOrderNow = handleAddToCart;

  return (
    <>
      <div className="space-y-6 mt-4">
        {/* Quantity Selector */}
        <div>
          <label className="font-albert text-black text-lg mb-2 block">Quantity</label>
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
              {/* Social Icons: always visible on mobile, inline before Share label */}
              <span className="flex gap-1 lg:hidden ml-1">
                <a href="https://www.facebook.com/share/1EVwQs5T9X/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-black hover:text-[#B8860B]">
                  <FaFacebookF />
                </a>
                <a href="https://www.instagram.com/ecobambo0?igsh=a3dpZ3NiY2R6d3Uw&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-black hover:text-[#B8860B]">
                  <FaInstagram />
                </a>
                <a href="https://www.tiktok.com/@ecobambo0?_t=ZS-8uYnW51R4Sb&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-black hover:text-[#B8860B]">
                  <FaTiktok />
                </a>
                <a href="https://www.youtube.com/channel/UCMEfaztIY2KxW6fFh_J8zmw" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-black hover:text-[#B8860B]">
                  <FaYoutube />
                </a>
                <a href="https://wa.me/923416995870" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-black hover:text-[#B8860B]">
                  <FaWhatsapp />
                </a>
              </span>
              <span>Share</span>
            </button>
            {/* Desktop: only on hover/click */}
            <div
              className={`hidden lg:flex gap-2 mt-2 items-center flex-row transition-opacity duration-200 ${showDesktopShare || showShare ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              onMouseEnter={() => setShowDesktopShare(true)}
              onMouseLeave={() => setShowDesktopShare(false)}
            >
              <a href="https://www.facebook.com/share/1EVwQs5T9X/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-black hover:text-[#B8860B]">
                  <FaFacebookF />
                </a>
              <a href="https://www.instagram.com/ecobambo0?igsh=a3dpZ3NiY2R6d3Uw&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-black hover:text-[#B8860B]">
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com/@ecobambo0?_t=ZS-8uYnW51R4Sb&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-black hover:text-[#B8860B]">
                <FaTiktok />
              </a>
              <a href="https://www.youtube.com/channel/UCMEfaztIY2KxW6fFh_J8zmw" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-black hover:text-[#B8860B]">
                  <FaYoutube />
                </a>
              <a href="https://wa.me/923416995870" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-black hover:text-[#B8860B]">
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
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[350px] bg-white shadow-xl p-6 z-50">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-lg text-black font-semibold mb-4">{product.title}</h2>
            <p className="mb-2 text-black text-sm">
              <strong>Color:</strong> {selectedVariant.color}
            </p>
            <h3 className="font-semibold text-black mb-2">Eco Bamboo</h3>
            <p className="text-sm text-black mb-1">
              Pickup available, usually text- ready in 24 hours
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
      )
      }

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
            <h2 className="text-xl text-black font-albert font-bold mb-4">Returns & Exchanges Policy</h2>
            <p className="text-sm text-black font-jost leading-relaxed whitespace-pre-wrap">
              {/* 📝 Your full return policy text goes here */}
At Eco Bamboo, we are committed to providing high-quality, eco-friendly products. If you are not satisfied with your purchase, you can request a return or refund based on the conditions outlined below.
1. Return Policy
We offer a flexible return policy for both domestic and international orders:
Pakistan Orders: Returns must be requested within 7 to 14 days of receiving the product.
International Orders: Returns must be requested within 15 to 30 days of receiving the product.
Return Request Deadline:
You must initiate your return request within 2 to 3 days of receiving the order.
Requests submitted after 3 days will not be accepted.
Eligibility for Returns
To be eligible for a return, your item must:
Be unused, unworn, and in its original packaging
Include tags, accessories, and proof of purchase (receipt or order confirmation)
Be returned for one of the following valid reasons:
Damaged product received
Color difference from what was ordered
Size issue
Other solid reasons approved by our team
Return Proof Requirement: Customers must provide photo or video evidence of the issue before the return is approved.
How to Request a Return:
Email us at ecobambooarts@gmail.com with your order number and proof of the issue.
Return Address:
Bamboohandicrafts, Near PSO Petrol Pump Chakian, Shop Number 35, Karkhane Wali Abadi, Near Ali Niaz Sweet, Chakian, Karkhane Wali Abadi, Dakkhana Khas, Dhori, Tehsil Bhalwal, District Sargodha, Postal Code 40100, Phularwa 40410, Pakistan.
Important: Items sent back without prior approval will not be accepted.
2. Damages & Issues
Please inspect your order upon delivery. If your item is damaged, defective, or incorrect, contact us immediately at ecobambooarts@gmail.com or call us at +92 341 6995870 so we can resolve the issue.
3. Non-Returnable Items
Certain items cannot be returned, including:
Used or washed items
If you have any questions about the return eligibility of your item, please contact us before initiating a return.
4. Exchange Policy
If you need a different size or color, the fastest way to get the right product is to:
Request a return for your current item
Once approved, place a new order for the correct product
Exchanges will be processed only after we receive and inspect the returned item.
5. Refund Process
Once we receive and inspect your returned item, we will notify you about the refund approval status.
Approved Refunds: The amount will be refunded to your original payment method within 10 business days.
Processing Time: Some banks or credit card companies may take additional time to process the refund.
If 15 business days have passed since your refund was approved and you haven't received it, please contact us at ecobambooarts@gmail.com or call us at +92 341 6995870.
Need Help?
For any return or refund-related queries, feel free to contact us:
Email: ecobambooarts@gmail.com
Phone: +92 341 6995870
Return Address:
Bamboohandicrafts, Near PSO Petrol Pump Chakian, Shop Number 35, Karkhane Wali Abadi, Near Ali Niaz Sweet, Chakian, Karkhane Wali Abadi, Dakkhana Khas, Dhori, Tehsil Bhalwal, District Sargodha, Postal Code 40100, Phularwa 40410, Pakistan.
We are happy to assist you! </p>
          </div>
        </div>
      )
      }
    </>
  );
};

export default AddToCart;
