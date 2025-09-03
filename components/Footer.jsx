import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const specialSlugs = [
    "/products/large-bamboo-standing-plant-pot-unique-affordable",
    "/products/small-bamboo-flower-pot-with-stand-stylish-indoor-artificial-pot",
    "/products/1-unique-bamboo-wall-hanging-affordable-home-wall-art-decor-in-small-sizes-for-living-areas",
    "/products/small-bamboo-hanging-with-stand-stylish-home-wall-art-decor"
  ];

  function getLinkHref(href) {
    if (specialSlugs.some(slug => href.endsWith(slug))) {
      return href;
    }
    if (href.startsWith("http")) return href;
    return `https://ecobambo.com${href}`;
  }

  return (
    <div className="bg-black px-0 py-4 sm:py-6 lg:py-8 font-sans text-left w-full">
      {/* Main footer container */}
      <div className="eco-form-container bg-black shadow-lg rounded-xl p-2 md:p-4 flex flex-col lg:flex-row lg:space-x-10 w-full mb-8 text-left">
        {/* Left Side: Map and Contact Information */}
        <div className="eco-form-left lg:w-1/2 mb-8 lg:mb-0">
          {/* Google Map Embed */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.721621062956!2d73.04428697548633!3d32.355431473842685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3921bf006fcc3de3%3A0x3643630eda44aab0!2sEco%20bambo!5e1!3m2!1sen!2str!4v1746090563049!5m2!1sen!2str&zoomcontrol=0&controls=0&disableDefaultUI=1"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-xl mb-4 w-full h-[200px]"
          ></iframe>
          {/* Link to Google Maps */}
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

          <div className="eco-contact-info space-y-6">
            {/* Location */}
            <div className="eco-info-box flex items-start space-x-3 pl-2">
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
            <div className="eco-info-box flex items-start space-x-3 pl-2">
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
            <div className="eco-info-box flex items-start space-x-3 pl-2">
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
            <div className="eco-info-box flex items-start space-x-3 pl-2">
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

        {/* Right Side: Contact Form */}
        <div className="eco-form-right w-full lg:w-1/2 px-2 sm:px-6 md:px-8">
          <h3 className="text-lg sm:text-xl font-semibold text-[#cccccc] mb-6  text-left">
            Want a faster reply? Tap the WhatsApp button to chat directly with our support team.<br />
            Or fill out this product inquiry form with your details & selected collection. Also, paste the exact product title in the message box — so our team can guide you faster with price, customization & size.
          </h3>
          <form method="post" action="/contact#contact_form" id="contact_form" acceptCharset="UTF-8" className="space-y-2 sm:space-y-4">
            <input type="hidden" name="form_type" value="contact" />
            <input type="hidden" name="utf8" value="✓" />

            <input type="text" name="contact[first_name]" placeholder="First Name*" required className="w-full bg-[#181818] text-[rgb(184,134,11,1)] border border-[#333] rounded px-4 py-2 focus:outline-none focus:border-white focus:text-[rgb(184,134,11,1)] placeholder:text-white hover:border-white" />

            <input type="text" name="contact[last_name]" placeholder="Last Name*" required className="w-full bg-[#181818] text-[rgb(184,134,11,1)] border border-[#333] rounded px-4 py-2 focus:outline-none focus:border-white focus:text-[rgb(184,134,11,1)] placeholder:text-white hover:border-white" />

            <input type="text" name="contact[location]" placeholder="Your Location*" required className="w-full bg-[#181818] text-[rgb(184,134,11,1)] border border-[#333] rounded px-4 py-2 focus:outline-none focus:border-white focus:text-[rgb(184,134,11,1)] placeholder:text-white hover:border-white" />

            <input type="text" name="contact[phone]" placeholder="Phone Number*" required className="w-full bg-[#181818] text-[rgb(184,134,11,1)] border border-[#333] rounded px-4 py-2 focus:outline-none focus:border-white focus:text-[rgb(184,134,11,1)] placeholder:text-white hover:border-white" />

            <input type="email" name="contact[email]" placeholder="Email*" required className="w-full bg-[#181818] text-[rgb(184,134,11,1)] border border-[#333] rounded px-4 py-2 focus:outline-none focus:border-white focus:text-[rgb(184,134,11,1)] placeholder:text-white hover:border-white" />

            <select name="contact[collection]" required className="w-full bg-[#181818] text-amber-400 border border-[#333] rounded px-4 py-2 focus:outline-none focus:border-amber-400">
              <option value="" className="text-amber-300">Select Collection</option>
              <option>Bamboo Flower pot</option>
              <option>Bamboo Hanging Wall</option>
              <option>Bamboo House</option>
              <option>Bamboo Gazebo</option>
              <option>Bamboo Canopy</option>
              <option>Bamboo Car garage</option>
              <option>Bamboo Fences</option>
              <option>Bamboo Wall Panel</option>
              <option>Bamboo Pot Stands</option>
              <option>Dining Table Set</option>
              <option>Baby Beds</option>
              <option>Kid's Furniture</option>
              <option>Bamboo Double & Single Beds</option>
              <option>Bamboo Sofa Set</option>
              <option>Bamboo Swings</option>
              <option>Bamboo Baby Swings</option>
            </select>

            <textarea name="contact[body]" placeholder="Your Message (Optional)" rows="4" className="w-full bg-[#181818] text-[rgb(184,134,11,1)] border border-[#333] rounded px-4 py-2 focus:outline-none focus:border-white focus:text-[rgb(184,134,11,1)] placeholder:text-white hover:border-white"></textarea>
            <button type="submit" className=" text-black font-semibold px-6 py-2 rounded shadow bg-[#F5C240] transition-all">BOOK NOW →</button>
          </form>
        </div>
      </div>

      {/* New Footer Section */}
      <footer className="footer bg-black ml-6 text-white py-12 px-0 w-full rounded-xl shadow-lg text-center">
        <div className="footer__content-top w-full grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 items-start text-center">
          {/* Outdoor Bamboo Structures */}
          <div className="footer-block text-left ml-4 md:ml-0 mt-0 pt-0">
            <h2 className="footer-block__heading text-lg lg:text-xl font-dm text-[17px] font-dm text-[#b8860b] mb-4"><strong>Outdoor Bamboo Structures</strong></h2>
            <ul className="footer-block__details-content list-none p-0">
              <li><a href="https://ecobambo.com/collections/bamboo-canopy-in-pakistan/Canopy" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo Canopy Bliss</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-house-luxury/House" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo House Retreat</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-shades-for-carports-ceiling-design-elegant-solutions-of-car-vigo-for-you/garage" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo Carport Haven</a></li>
              <li><a href="https://ecobambo.com/collections/premium-bamboo-gazebo/Gazebo" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo Gazebo Escape</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-wall-designs/Walls" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo Wall Panels - Decor</a></li>
            </ul>
          </div>

          {/* Indoor Bamboo Comfort */}
          <div className="footer-block text-left ml-4 md:ml-0 mt-0 pt-0">
            <h2 className="footer-block__heading text-lg lg:text-xl font-dm text-[17px]  text-[#b8860b] mb-4"><strong>Indoor Bamboo Comfort</strong></h2>
            <ul className="footer-block__details-content list-none p-0">
              <li><a href="https://ecobambo.com/collections/premium-bamboo-lounge-set-with-cushioned-seating-modern-outdoor-indoor-comfort" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Luxury Sofa Set</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-single-kid-bed" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo luxe Beds</a></li>
              <li><a href="https://ecobambo.com/collections/premium-bamboo-dining-sets/Chair-&-Table-Set" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo Chair Corner</a></li>
              <li><a href="https://ecobambo.com/collections/explore-the-best-bamboo-hanging-chairs-swing-garden-swings-and-rocking-swings-for-every-space/Swings" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo Family Swings</a></li>
              <li><a href="https://ecobambo.com/collections" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">All Eco Bamboo Collections</a></li>
            </ul>
          </div>

          {/* Home & Baby Essentials */}
          <div className="footer-block text-left ml-4 md:ml-0 mt-0 pt-0">
            <h2 className="footer-block__heading text-lg lg:text-xl font-dm text-[17px] text-[#b8860b] mb-4"><strong>Home & Baby Essentials</strong></h2>
            <ul className="footer-block__details-content list-none p-0">
              <li><a href="https://ecobambo.com/collections/eco-friendly-bamboo-kids-beds-perfect-for-children/Baby-Beds" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Baby Bamboo Beds - Cribs</a></li>
              <li><a href="https://ecobambo.com/collections/1-modern-bamboo-hanging-wall-art-standing-plant-and-flower-pot-stylish-decor-perfect-for-home-garden/Hanging-Walls" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo Hanging Walls - Art</a></li>
              <li><a href="https://ecobambo.com/collections/premium-bamboo-fence-panels-elegant-fence-wall-garden-fence-idea" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo Fence Panels- Decor</a></li>
              <li><a href="https://ecobambo.com/collections/1-modern-bamboo-hanging-wall-art-standing-plant-and-flower-pot-stylish-decor-perfect-for-home-garden/Flower-Pot" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Bamboo Flower Pots- Planters</a></li>
              <li><a href="https://ecobambo.com/collections/bamboo-kids-chair" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Baby Furniture - Nursery Sets</a></li>
            </ul>
          </div>

          {/* Eco Bambo Store Policies */}
          <div className="footer-block text-left ml-4 md:ml-0 mt-0 pt-0">
            <h2 className="footer-block__heading text-lg lg:text-xl font-dm text-[17px] text-[#b8860b] mb-4"><strong>Eco Bambo Store Policies</strong></h2>
            <ul className="footer-block__details-content list-none p-0">
              <li><a href="https://ecobambo.com/pages/https-www-yourwebsite-com-about-us" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">About Eco Bambo - Our Story & vision</a></li>
              <li><a href="https://ecobambo.com/policies/shipping-policy" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Shipping & Delivery Policy</a></li>
              <li><a href="https://ecobambo.com/policies/terms-of-service" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Terms & Conditions of Use</a></li>
              <li><a href="https://ecobambo.com/pages/https-www-yourwebsite-com/contact-us" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Contact & Customer Support</a></li>
              <li><a href="https://ecobambo.com/policies/privacy-policy" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Privacy Policy & Data Protection</a></li>
              <li><a href="https://ecobambo.com/policies/refund-policy" className="link text-base text-[rgb(184,134,11,1)] hover:text-amber-400 underline font-normal">Refund Policy & Customer Satisfaction</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="footer-block--newsletter flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-4 sm:space-y-0 mb-8 text-left">
          <ul className="list-none p-0 flex flex-wrap justify-center items-center gap-4 sm:gap-6" role="list">
            <li className="list-social__item">
              <a href="https://www.facebook.com/ecobambo0/?rdid=z5QewtB13VPrwVHp" className="link list-social__link text-[rgb(184,134,11,1)]" aria-label="Facebook">
                <span className="svg-wrapper"><svg className="icon icon-facebook w-6 h-6" viewBox="0 0 20 20"><path fill="currentColor" d="M18 10.049C18 5.603 14.419 2 10 2s-8 3.603-8 8.049C2 14.067 4.925 17.396 8.75 18v-5.624H6.719v-2.328h2.03V8.275c0-2.017 1.195-3.132 3.023-3.132.874 0 1.79.158 1.79.158v1.98h-1.009c-.994 0-1.303.621-1.303 1.258v1.51h2.219l-.355 2.326H11.25V18c3.825-.604 6.75-3.933 6.75-7.951"></path></svg></span>
                <span className="sr-only">Facebook</span>
              </a>
            </li>
            <li className="list-social__item">
              <a href="https://www.instagram.com/ecobambo0?igsh=a3dpZ3NiY2R6d3Uw&utm_source=qr" className="link list-social__link text-[rgb(184,134,11,1)]" aria-label="Instagram">
                <span className="svg-wrapper"><svg className="icon icon-instagram w-6 h-6" viewBox="0 0 20 20"><path fill="currentColor" fillRule="evenodd" d="M13.23 3.492c-.84-.037-1.096-.046-3.23-.046-2.144 0-2.39.01-3.238.055-.776.027-1.195.164-1.487.273a2.4 2.4 0 0 0-.912.593 2.5 2.5 0 0 0-.602.922c-.11.282-.238.702-.274 1.486-.046.84-.046 1.095-.046 3.23s.01 2.39.046 3.229c.004.51.097 1.016.274 1.495.145.365.319.639.602.913.282.282.538.456.92.602.474.176.974.268 1.479.273.848.046 1.103.046 3.238.046s2.39-.01 3.23-.046c.784-.036 1.203-.164 1.486-.273.374-.146.648-.329.921-.602.283-.283.447-.548.602-.922.177-.476.27-.979.274-1.486.037-.84.046-1.095.046-3.23s-.01-2.39-.055-3.229c-.027-.784-.164-1.204-.274-1.495a2.4 2.4 0 0 0-.593-.913 2.6 2.6 0 0 0-.92-.602c-.284-.11-.703-.237-1.488-.273ZM6.697 2.05c.857-.036 1.131-.045 3.302-.045a63 63 0 0 1 3.302.045c.664.014 1.321.14 1.943.374a4 4 0 0 1 1.414.922c.41.397.728.88.93 1.414.23.622.354 1.279.365 1.942C18 7.56 18 7.824 18 10.005c0 2.17-.01 2.444-.046 3.292-.036.858-.173 1.442-.374 1.943-.2.53-.474.976-.92 1.423a3.9 3.9 0 0 1-1.415.922c-.51.191-1.095.337-1.943.374-.857.036-1.122.045-3.302.045-2.171 0-2.445-.009-3.302-.055-.849-.027-1.432-.164-1.943-.364a4.15 4.15 0 0 1-1.414-.922 4.1 4.1 0 0 1-.93-1.423c-.183-.51-.329-1.085-.365-1.943C2.009 12.45 2 12.167 2 10.004c0-2.161 0-2.435.055-3.302.027-.848.164-1.432.365-1.942a4.4 4.4 0 0 1 .92-1.414 4.2 4.2 0 0 1 1.415-.93c.51-.183 1.094-.33 1.943-.366Zm.427 4.806a4.105 4.105 0 1 1 5.805 5.805 4.105 4.105 0 0 1-5.805-5.805m1.882 5.371a2.668 2.668 0 1 0 2.042-4.93 2.668 2.668 0 0 0-2.042 4.93m5.922-5.942a.958.958 0 1 1-1.355-1.355.958.958 0 0 1 1.355 1.355" clipRule="evenodd"></path></svg></span>
                <span className="sr-only">Instagram</span>
              </a>
            </li>
            <li className="list-social__item">
              <a href="https://www.youtube.com/channel/UCMEfaztIY2KxW6fFh_J8zmw" className="link list-social__link text-[rgb(184,134,11,1)]" aria-label="YouTube">
                <span className="svg-wrapper"><svg className="icon icon-youtube w-6 h-6" viewBox="0 0 20 20"><path fill="currentColor" d="M18.16 5.87c.34 1.309.34 4.08.34 4.08s0 2.771-.34 4.08a2.13 2.13 0 0 1-1.53 1.53c-1.309.34-6.63.34-6.63.34s-5.321 0-6.63-.34a2.13 2.13 0 0 1-1.53-1.53c-.34-1.309-.34-4.08-.34-4.08s0-2.771.34-4.08a2.17 2.17 0 0 1 1.53-1.53C4.679 4 10 4 10 4s5.321 0 6.63.34a2.17 2.17 0 0 1 1.53 1.53M8.3 12.5l4.42-2.55L8.3 7.4z"></path></svg></span>
                <span className="sr-only">YouTube</span>
              </a>
            </li>
            <li className="list-social__item">
              <a href="https://www.tiktok.com/@ecobambo0?_t=ZS-8uYnW51R4Sb&_r=1" className="link list-social__link text-[rgb(184,134,11,1)]" aria-label="TikTok">
                <span className="svg-wrapper"><svg className="icon icon-tiktok w-6 h-6" viewBox="0 0 20 20"><path fill="currentColor" d="M10.511 1.705h2.74s-.157 3.51 3.795 3.768v2.711s-2.114.129-3.796-1.158l.028 5.606A5.073 5.073 0 1 1 8.213 7.56h.708v2.785a2.298 2.298 0 1 0 1.618 2.205z"></path></svg></span>
                <span className="sr-only">TikTok</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__content-bottom text-center pt-8 ">
          <div className="footer__content-bottom-wrapper max-w-6xl mx-auto">
            <div className="footer__payment mb-4">
              <span className="sr-only">Payment methods</span>
              <ul className="list-none p-0 flex justify-start space-x-4 text-left">
                {/* Add payment method icons here if available */}
              </ul>
            </div>
          </div>

          <div className="footer_content-bottom-wrapper max-w-6xl md-mr-3 mx-auto px-4 pl-0">
  <div className="footer__copyright caption text-center flex flex-col lg:flex-row lg:flex-wrap lg:justify-center lg:items-center gap-0 lg:gap-x-4 lg:gap-y-0 text-center">
    
    {/* This container will control the wrapping for all copyright/policy links */}
    {/* On mobile: flex-wrap allows groups to stack. On desktop: lg:flex-nowrap forces single line. */}
    {/* gap-x-4 on this container adds horizontal space between the 'lines' (groups) on desktop. */}
    <div className="w-full flex flex-wrap justify-center gap-x-4 
                    lg:flex-nowrap lg:gap-x-4 lg:gap-y-0 lg:mb-0">
      
      {/* Group for the first line on mobile: "© 2025, ECO BAMBO. Refund policy." */}
      {/* mb-2 adds vertical space below this group on mobile. */}
      {/* gap-x-4 adds horizontal space between "ECO BAMBO" and "Refund policy" on mobile. */}
      <div className="flex flex-wrap justify-center mb-2 lg:mb-0 lg:flex-nowrap gap-x-4">
        <small className="copyright__content text-amber-300 whitespace-nowrap">
          © 2025, <a href="https://ecobambo.com/" className="text-amber-300 hover:text-amber-400">ECO BAMBO.</a>
        </small>
        <small className="copyright__content whitespace-nowrap">
          <a href="https://ecobambo.com/policies/refund-policy" className="text-amber-300 hover:text-amber-400">Refund policy.</a>
        </small>
      </div>

      {/* Group for the second line on mobile: "Terms of service. Shipping policy." */}
      {/* mb-2 adds vertical space below this group on mobile. */}
      {/* gap-x-4 adds horizontal space between "Terms of service" and "Shipping policy" on mobile. */}
      <div className="flex flex-wrap justify-center mb-2 lg:mb-0 lg:flex-nowrap gap-x-4">
        <small className="copyright__content whitespace-nowrap">
          <a href="https://ecobambo.com/policies/terms-of-service" className="text-amber-300 hover:text-amber-400">Terms of service.</a>
        </small>
        <small className="copyright__content whitespace-nowrap">
          <a href="https://ecobambo.com/policies/shipping-policy" className="text-amber-300 hover:text-amber-400">Shipping policy.</a>
        </small>
      </div>

      {/* Group for the third line on mobile: "Contact information." */}
      {/* No mb-2 needed as it's the last group. */}
      <div className="flex flex-wrap justify-center lg:flex-nowrap">
        <small className="copyright__content whitespace-nowrap">
          <a href="https://ecobambo.com/policies/contact-information" className="text-amber-300 hover:text-amber-400">Contact information.</a>
        </small>
      </div>
      
    </div>
  </div>
</div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;