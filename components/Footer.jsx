import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-black w-full text-white font-sans">
      {/* Main Footer Container */}
      <div className="w-full px-4 py-6 md:py-8 lg:py-10 max-w-7xl mx-auto">

        {/* Left Side: Contact Information */}
        <div className="flex flex-col lg:flex-row lg:space-x-10 mb-8">
          <div className="lg:w-1/2 mb-6 lg:mb-0 space-y-4">
            <h3 className="text-xl font-semibold text-white">Find us</h3>

            <div>
              <h4 className="text-base font-semibold text-white">Location</h4>
              <p className="text-[rgb(184,134,11)] text-sm">
                Eco Bambo, Karkhane wali abadi, Near PSO pump petrol,<br />
                Nazd Ali Niaz Sweet, Chakian, Phularwan, Bhalwal 40410, Pakistan
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-white">Email</h4>
              <p className="text-[rgb(184,134,11)] text-sm">
                <a href="mailto:ecobambooarts@gmail.com" className="hover:text-white">
                  ecobambooarts@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-white">Phone</h4>
              <p className="text-[rgb(184,134,11)] text-sm">
                <a href="tel:+923416995870" className="hover:text-white">
                  +92 (3416995870)
                </a>
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-white">Opening & Closing Hours</h4>
              <p className="text-[rgb(184,134,11)] text-sm">Mon–Sun: 8:00 AM – 6:00 PM</p>
              <p className="text-[rgb(184,134,11)] text-sm">Friday: Closed</p>
            </div>
          </div>

          {/* Right Side: (Empty, since form is removed) */}
          <div className="lg:w-1/2"></div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h4 className="text-[#b8860b] font-semibold mb-2">Outdoor Bamboo Structures</h4>
            <ul className="space-y-1 text-[rgb(184,134,11)] text-sm">
              <li><a href="https://ecobambo.com/collections/bamboo-canopy-in-pakistan/Canopy" className="hover:text-amber-400">Bamboo Canopy Bliss</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-house-luxury/House" className="hover:text-amber-400">Bamboo House Retreat</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-shades-for-carports-ceiling-design-elegant-solutions-of-car-vigo-for-you/garage" className="hover:text-amber-400">Bamboo Carport Haven</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#b8860b] font-semibold mb-2">Indoor Bamboo Comfort</h4>
            <ul className="space-y-1 text-[rgb(184,134,11)] text-sm">
              <li><a href="https://ecobambo.com/collections/premium-bamboo-lounge-set-with-cushioned-seating-modern-outdoor-indoor-comfort" className="hover:text-amber-400">Luxury Sofa Set</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-single-kid-bed" className="hover:text-amber-400">Bamboo luxe Beds</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#b8860b] font-semibold mb-2">Home & Baby Essentials</h4>
            <ul className="space-y-1 text-[rgb(184,134,11)] text-sm">
              <li><a href="https://ecobambo.com/collections/eco-friendly-bamboo-kids-beds-perfect-for-children/Baby-Beds" className="hover:text-amber-400">Baby Bamboo Beds - Cribs</a></li>
              <li><a href="https://ecobambo.com/collections/1-modern-bamboo-hanging-wall-art-standing-plant-and-flower-pot-stylish-decor-perfect-for-home-garden/Hanging-Walls" className="hover:text-amber-400">Bamboo Hanging Walls</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#b8860b] font-semibold mb-2">Eco Bambo Store Policies</h4>
            <ul className="space-y-1 text-[rgb(184,134,11)] text-sm">
              <li><a href="https://ecobambo.com/policies/shipping-policy" className="hover:text-amber-400">Shipping & Delivery Policy</a></li>
              <li><a href="https://ecobambo.com/policies/terms-of-service" className="hover:text-amber-400">Terms & Conditions</a></li>
              <li><a href="https://ecobambo.com/policies/refund-policy" className="hover:text-amber-400">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-[rgb(184,134,11)] text-sm space-y-1 md:space-y-0 md:flex md:justify-center md:space-x-4">
          <p>© 2025, <a href="https://ecobambo.com" className="hover:text-amber-400">ECO BAMBO</a></p>
          <p><a href="https://ecobambo.com/policies/refund-policy" className="hover:text-amber-400">Refund Policy</a></p>
          <p><a href="https://ecobambo.com/policies/terms-of-service" className="hover:text-amber-400">Terms of Service</a></p>
          <p><a href="https://ecobambo.com/policies/shipping-policy" className="hover:text-amber-400">Shipping Policy</a></p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
