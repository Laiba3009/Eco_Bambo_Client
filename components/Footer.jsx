import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="bg-black px-0 py-4 sm:py-6 lg:py-8 font-sans text-left w-full">
      {/* Main footer container */}
      <div className="bg-black shadow-lg rounded-xl p-2 md:p-4 flex flex-col lg:flex-row lg:space-x-10 w-full mb-8 text-left">
        {/* Left Side: Map and Contact Information */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          {/* Google Map Embed */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.721621062956!2d73.04428697548633!3d32.355431473842685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3921bf006fcc3de3%3A0x3643630eda44aab0!2sEco%20bambo!5e1!3m2!1sen!2str!4v1746090563049!5m2!1sen!2str&zoomcontrol=0&controls=0&disableDefaultUI=1"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-xl mb-4 w-full h-[200px]"
          ></iframe>

          <a
            href="https://www.google.com/maps/place/Eco+bambo/@32.3554315,73.044287,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[rgb(184,134,11,1)] hover:underline font-medium mb-6 block underline text-left"
          >
            View on Google Maps
          </a>

          {/* Find Us Heading */}
          <h3 className="text-xl font-semibold text-white mb-4 text-left">Find us</h3>

          <div className="space-y-6">
            {/* Location */}
            <div className="flex items-start space-x-3 pl-2">
              <i className="fas fa-map-marker-alt text-amber-400 text-xl mt-1"></i>
              <div>
                <h4 className="text-base font-semibold text-white text-left">Location</h4>
                <p className="text-[rgb(184,134,11,1)] text-left text-sm">
                  Eco Bambo, Karkhane wali abadi, Near PSO pump petrol,<br />
                  Nazd Ali Niaz Sweet, Chakian, Phularwan, Bhalwal 40410, Pakistan
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3 pl-2">
              <i className="fas fa-envelope text-amber-400 text-xl mt-1"></i>
              <div>
                <h4 className="text-base font-semibold text-white text-left">Email</h4>
                <p className="text-[rgb(184,134,11,1)] text-left text-sm">
                  <a href="mailto:ecobambooarts@gmail.com" className="no-underline hover:text-white">
                    ecobambooarts@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3 pl-2">
              <i className="fab fa-whatsapp text-amber-400 text-xl mt-1"></i>
              <div>
                <h4 className="text-base font-semibold text-white text-left">Phone</h4>
                <p className="text-[rgb(184,134,11,1)] text-left text-sm">
                  <a href="tel:+923416995870" className="no-underline hover:text-white">
                    +92 (3416995870)
                  </a>
                </p>
              </div>
            </div>

            {/* Company Hours */}
            <div className="flex items-start space-x-3 pl-2">
              <i className="fas fa-clock text-amber-400 text-xl mt-1"></i>
              <div>
                <h4 className="text-base font-semibold text-white text-left">Opening & Closing Hours</h4>
                <p className="text-[rgb(184,134,11,1)] text-left text-sm">Mon–Sun: 8:00 AM – 6:00 PM</p>
                <p className="text-[rgb(184,134,11,1)] text-left text-sm">
                  <i className="fas fa-times-circle text-red-500 mr-1"></i>Friday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links & Social */}
      <footer className="footer bg-black ml-6 text-white py-12 px-0 w-full rounded-xl shadow-lg text-center">
        <div className="footer__content-top w-full grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 items-start text-center">
          {/* Outdoor Bamboo Structures */}
          <div className="footer-block text-left ml-4 md:ml-0 mt-0 pt-0">
            <h2 className="footer-block__heading text-lg lg:text-xl text-[#b8860b] mb-4 font-semibold">Outdoor Bamboo Structures</h2>
            <ul className="list-none p-0">
              <li><a href="https://ecobambo.com/collections/bamboo-canopy-in-pakistan/Canopy" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo Canopy Bliss</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-house-luxury/House" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo House Retreat</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-shades-for-carports-ceiling-design-elegant-solutions-of-car-vigo-for-you/garage" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo Carport Haven</a></li>
              <li><a href="https://ecobambo.com/collections/premium-bamboo-gazebo/Gazebo" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo Gazebo Escape</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-wall-designs/Walls" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo Wall Panels - Decor</a></li>
            </ul>
          </div>

          {/* Indoor Bamboo Comfort */}
          <div className="footer-block text-left ml-4 md:ml-0 mt-0 pt-0">
            <h2 className="text-lg lg:text-xl text-[#b8860b] mb-4 font-semibold">Indoor Bamboo Comfort</h2>
            <ul className="list-none p-0">
              <li><a href="https://ecobambo.com/collections/premium-bamboo-lounge-set-with-cushioned-seating-modern-outdoor-indoor-comfort" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Luxury Sofa Set</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-single-kid-bed" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo luxe Beds</a></li>
              <li><a href="https://ecobambo.com/collections/premium-bamboo-dining-sets/Chair-&-Table-Set" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo Chair Corner</a></li>
              <li><a href="https://ecobambo.com/collections/explore-the-best-bamboo-hanging-chairs-swing-garden-swings-and-rocking-swings-for-every-space/Swings" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo Family Swings</a></li>
              <li><a href="https://ecobambo.com/collections" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">All Eco Bamboo Collections</a></li>
            </ul>
          </div>

          {/* Home & Baby Essentials */}
          <div className="footer-block text-left ml-4 md:ml-0 mt-0 pt-0">
            <h2 className="text-lg lg:text-xl text-[#b8860b] mb-4 font-semibold">Home & Baby Essentials</h2>
            <ul className="list-none p-0">
              <li><a href="https://ecobambo.com/collections/eco-friendly-bamboo-kids-beds-perfect-for-children/Baby-Beds" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Baby Bamboo Beds - Cribs</a></li>
              <li><a href="https://ecobambo.com/collections/1-modern-bamboo-hanging-wall-art-standing-plant-and-flower-pot-stylish-decor-perfect-for-home-garden/Hanging-Walls" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo Hanging Walls - Art</a></li>
              <li><a href="https://ecobambo.com/collections/premium-bamboo-fence-panels-elegant-fence-wall-garden-fence-idea" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo Fence Panels- Decor</a></li>
              <li><a href="https://ecobambo.com/collections/1-modern-bamboo-hanging-wall-art-standing-plant-and-flower-pot-stylish-decor-perfect-for-home-garden/Flower-Pot" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Bamboo Flower Pots- Planters</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-kids-chair" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Baby Furniture - Nursery Sets</a></li>
            </ul>
          </div>

          {/* Store Policies */}
          <div className="footer-block text-left ml-4 md:ml-0 mt-0 pt-0">
            <h2 className="text-lg lg:text-xl text-[#b8860b] mb-4 font-semibold">Eco Bambo Store Policies</h2>
            <ul className="list-none p-0">
              <li><a href="https://ecobambo.com/pages/https-www-yourwebsite-com-about-us" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">About Eco Bambo - Our Story & vision</a></li>
              <li><a href="https://ecobambo.com/policies/shipping-policy" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Shipping & Delivery Policy</a></li>
              <li><a href="https://ecobambo.com/policies/terms-of-service" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Terms & Conditions of Use</a></li>
              <li><a href="https://ecobambo.com/pages/https-www-yourwebsite-com/contact-us" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Contact & Customer Support</a></li>
              <li><a href="https://ecobambo.com/policies/privacy-policy" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Privacy Policy & Data Protection</a></li>
              <li><a href="https://ecobambo.com/policies/refund-policy" className="text-[rgb(184,134,11,1)] hover:text-amber-400 underline">Refund Policy & Customer Satisfaction</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
