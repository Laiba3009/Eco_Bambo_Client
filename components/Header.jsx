import React, { useState, useEffect } from "react";
import Link from "next/link";
import HeaderAnnouncementSlider from "./HeaderAnnouncementSlider";
import Image from "next/image";

const menu = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Bamboo House",
    submenu: [
      {
        label: "Best Sellers",
        href: "/collections/1-modern-bamboo-hanging-wall-art-standing-plant-and-flower-pot-stylish-decor-perfect-for-home-garden",
      },
      { label: "Bamboo Home", href: "/collections/bamboo-house-luxury/House" },
      {
        label: "Eco Serenity Gazebos",
        href: "/collections/premium-bamboo-gazebo/Gazebo",
      },
      {
        label: "The Zen Canopies",
        href: "/collections/bamboo-canopy-in-pakistan/Canopies",
      },
      {
        label: "Carports Garage",
        href: "/collections/bamboo-shades-for-carports-ceiling-design-elegant-solutions-of-car-vigo-for-you",
      },
    ],
  },
  {
    label: "Bamboo Living",
    submenu: [
      {
        label: "Dining Table Set",
        href: "/collections/premium-bamboo-dining-sets/Bamboo-Chair-Table",
      },
      {
        label: "Luxury Sofa Set",
        href: "/collections/premium-bamboo-lounge-set-with-cushioned-seating-modern-outdoor-indoor-comfort",
      },
      { label: "Bamboo Dream Beds", href: "/collections/bamboo-single-kid-bed/Beds" },
      {
        label: "Multi Purpose Aura Stands",
        href: "/collections/stylish-bamboo-plant-stands-pot-stands-for-indoor-outdoor-spaces-plant-holders-racks-and-shelves/Stands",
      },
    ],
  },
  {
    label: "Bamboo Boundaries",
    submenu: [
      {
        label: "Bamboo Garden Frames",
        href: "/collections/premium-bamboo-fence-panels-elegant-fence-wall-garden-fence-idea/Fence",
      },
      { label: "Natural Privacy Walls", href: "/collections/bamboo-wall-designs/Walls" },
    ],
  },
  {
    label: "Kids Planet",
    submenu: [
      { label: "Baby Beds", href: "/collections/eco-friendly-bamboo-kids-beds-perfect-for-children/Beds-Stylish" },
      { label: "Baby Furniture", href: "/collections/bamboo-kids-chair" },
      {
        label: "Relax & Play Swings",
        href: "/collections/explore-the-best-bamboo-hanging-chairs-swing-garden-swings-and-rocking-swings-for-every-space",
      },
    ],
  },
  {
    label: "Categories",
    href: "/collections",
  },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/ecobambo0/?rdid=z5QewtB13VPrwVHp",
    label: "Facebook",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M18 10.049C18 5.603 14.419 2 10 2s-8 3.603-8 8.049C2 14.067 4.925 17.396 8.75 18v-5.624H6.719v-2.328h2.03V8.275c0-2.017 1.195-3.132 3.023-3.132.874 0 1.79.158 1.79.158v1.98h-1.009c-.994 0-1.303.621-1.303 1.258v1.51h2.219l-.355 2.326H11.25V18c3.825-.604 6.75-3.933 6.75-7.951"></path>
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/ecobambo0?igsh=a3dpZ3NiY2R6d3Uw&utm_source=qr",
    label: "Instagram",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M13.23 3.492c-.84-.037-1.096-.046-3.23-.046-2.144 0-2.39.01-3.238.055-.776.027-1.195.164-1.487.273a2.4 2.4 0 0 0-.912.593 2.5 2.5 0 0 0-.602.922c-.11.282-.238.702-.274 1.486-.046.84-.046 1.095-.046 3.23s.01 2.39.046 3.229c.004.51.097 1.016.274 1.495.145.365.319.639.602.913.282.282.538.456.92.602.474.176.974.268 1.479.273.848.046 1.103.046 3.238.046s2.39-.01 3.23-.046c.784-.036 1.203-.164 1.486-.273.374-.146.648-.329.921-.602.283-.283.447-.548.602-.922.177-.476.27-.979.274-1.486.037-.84.046-1.095.046-3.23s-.01-2.39-.055-3.229c-.027-.784-.164-1.204-.274-1.495a2.4 2.4 0 0 0-.593-.913 2.6 2.6 0 0 0-.92-.602c-.284-.11-.703-.237-1.488-.273ZM6.697 2.05c.857-.036 1.131-.045 3.302-.045a63 63 0 0 1 3.302.045c.664.014 1.321.14 1.943.374a4 4 0 0 1 1.414.922c.41.397.728.88.93 1.414.23.622.354 1.279.365 1.942C18 7.56 18 7.824 18 10.005c0 2.17-.01 2.444-.046 3.292-.036.858-.173 1.442-.374 1.943-.2.53-.474.976-.92 1.423a3.9 3.9 0 0 1-1.415.922c-.51.191-1.095.337-1.943.374-.857.036-1.122.045-3.302.045-2.171 0-2.445-.009-3.302-.055-.849-.027-1.432-.164-1.943-.364a4.15 4.15 0 0 1-1.414-.922 4.1 4.1 0 0 1-.93-1.423c-.183-.51-.329-1.085-.365-1.943C2.009 12.45 2 12.167 2 10.004c0-2.161 0-2.435.055-3.302.027-.848.164-1.432.365-1.942a4.4 4.4 0 0 1 .92-1.414 4.2 4.2 0 0 1 1.415-.93c.51-.183 1.094-.33 1.943-.366Zm.427 4.806a4.105 4.105 0 1 1 5.805 5.805 4.105 4.105 0 0 1-5.805-5.805m1.882 5.371a2.668 2.668 0 1 0 2.042-4.93 2.668 2.668 0 0 0-2.042 4.93m5.922-5.942a.958.958 0 1 1-1.355-1.355.958.958 0 0 1 1.355 1.355"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@ecobambo0?_t=ZS-8uYnW51R4Sb&_r=1",
    label: "TikTok",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.511 1.705h2.74s-.157 3.51 3.795 3.768v2.711s-2.114.129-3.796-1.158l.028 5.606A5.073 5.073 0 1 1 8.213 7.56h.708v2.785a2.298 2.298 0 1 0 1.618 2.205z"></path>
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/channel/UCMEfaztIY2KxW6fFh_J8zmw",
    label: "YouTube",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M18.16 5.87c.34 1.309.34 4.08.34 4.08s0 2.771-.34 4.08a2.13 2.13 0 0 1-1.53 1.53c-1.309.34-6.63.34-6.63.34s-5.321 0-6.63-.34a2.13 2.13 0 0 1-1.53-1.53c-.34-1.309-.34-4.08-.34-4.08s0-2.771.34-4.08a2.17 2.17 0 0 1 1.53-1.53C4.679 4 10 4 10 4s5.321 0 6.63.34a2.17 2.17 0 0 1 1.53 1.53M8.3 12.5l4.42-2.55L8.3 7.4z"></path>
      </svg>
    ),
  },
];

const specialSlugs = [
  "/products/large-bamboo-standing-plant-pot-unique-affordable",
  "/products/small-bamboo-flower-pot-with-stand-stylish-indoor-artificial-pot",
  "/products/1-unique-bamboo-wall-hanging-affordable-home-wall-art-decor-in-small-sizes-for-living-areas",
  "/products/small-bamboo-hanging-with-stand-stylish-home-wall-art-decor",
];

function getLinkHref(href) {
  if (specialSlugs.some((slug) => href.endsWith(slug))) {
    return href;
  }
  if (href.startsWith("http")) return href;
  return `https://ecobambo.com${href}`;
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Desktop submenu state
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showGoldBar, setShowGoldBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Mobile sidebar specific states
  const [activeMobileSubmenuIndex, setActiveMobileSubmenuIndex] = useState(null); // Tracks which submenu is currently open in mobile
  const [mobileMenuTransitionDirection, setMobileMenuTransitionDirection] =
    useState(""); // 'forward' or 'backward' for animation
  const [tempMobileSubmenuIndex, setTempMobileSubmenuIndex] = useState(null); // Used to hold submenu index during backward transition

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        setShowGoldBar(true);
        setLastScrollY(window.scrollY);
        return;
      }
      if (window.scrollY < lastScrollY) {
        setShowGoldBar(true); // scrolling up
      } else if (window.scrollY > lastScrollY) {
        setShowGoldBar(false); // scrolling down
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleDocumentClick(e) {
      // Only for desktop
      if (window.innerWidth < 1024) return;
      // If a submenu is open and click is outside any menu button or submenu
      if (openSubmenu !== null) {
        const menuRoot = document.getElementById('desktop-header-menu-root');
        if (menuRoot && !menuRoot.contains(e.target)) {
          setOpenSubmenu(null);
        }
      }
    }
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [openSubmenu]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      const shopifySearchUrl = `https://ecobambo.com/search?q=${encodeURIComponent(
        searchTerm.trim()
      )}`;
      window.location.href = shopifySearchUrl;
    }
  };

  // Function to open mobile submenu
  const openMobileSubmenu = (index) => {
    setMobileMenuTransitionDirection("forward");
    setTempMobileSubmenuIndex(index); // Set the index immediately for forward
    setTimeout(() => {
      setActiveMobileSubmenuIndex(index); // Actual active state after transition starts
      setMobileMenuTransitionDirection(""); // Clear direction after transition
      setTempMobileSubmenuIndex(null); // Clear temp index
    }, 50); // Small delay to ensure `forward` class is applied before `activeMobileSubmenuIndex` changes
  };

  // Function to go back to main mobile menu
  const goBackToMainMenu = () => {
    setMobileMenuTransitionDirection("backward");
    setTempMobileSubmenuIndex(activeMobileSubmenuIndex); // Keep the submenu content rendered during backward animation
    setActiveMobileSubmenuIndex(null); // Immediately move the active state for the main menu to appear

    // This timeout will clear the temporary submenu content after the animation
    setTimeout(() => {
      setMobileMenuTransitionDirection(""); // Reset animation direction
      setTempMobileSubmenuIndex(null); // Clear temporary submenu content
    }, 300); // Match this duration to your CSS transition duration
  };

  return (
    <>
      {showSearch ? (
        <>
          {/* Gold announcement bar stays visible */}
          <div className="w-full bg-[#B8860B] flex items-center border-b h-12 border-[rgba(184,134,11,0.15)]">
            <div className="max-w-[130rem] mx-auto flex items-center justify-between px-4 py-1 w-full h-12 items-center">
              <ul className="hidden lg:flex gap-4 items-center h-full">
                {socialLinks.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="hover:opacity-80 "
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex-1 flex justify-center">
                <HeaderAnnouncementSlider />
              </div>
              <div className="w-8" />
            </div>
          </div>
          {/* Translucent gold overlay over the rest of the screen */}
          <div
            className="fixed inset-0 z-[99]"
            style={{ background: "rgba(184,134,11,0.5)", top: "3rem" }}
            onClick={() => setShowSearch(false)}
            aria-label="Close search overlay"
          />
          {/* Black header overlay with search bar */}
          <div
            className="w-full h-2 flex items-center justify-center bg-black border-b border-[rgba(184,134,11,0.08)] sticky top-12 left-0 z-[100]"
            style={{ minHeight: "2.2rem" }}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full max-w-2xl px-4"
            >
              <input
                type="search"
                autoFocus
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 h-[1.8rem] border-2 rounded text-lg bg-black text-[rgb(184,134,11,1)] border-[rgb(184,134,11,1)] placeholder-[rgb(184,134,11,1)] focus:outline-none"
                style={{ "::placeholder": { color: "rgb(184,134,11,1)" } }}
                aria-label="Search"
              />
              <button
                type="submit"
                className="ml-3 p-2 text-[rgb(184,134,11,1)] hover:text-white"
                aria-label="Submit search"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="ml-2 p-2 text-[rgb(184,134,11,1)] hover:text-white"
                aria-label="Close search"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </svg>
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          {/* Utility Bar */}
          {showGoldBar && (
            <div className="w-full bg-[#B8860B] flex items-center border-b h-12 border-[rgba(184,134,11,0.15)] fixed top-0 left-0 z-[60] transition-all duration-300">
              <div className="max-w-[130rem] mx-auto flex items-center justify-between px-4 py-1 w-full h-12 items-center">
                {/* Social Icons - always left */}
                <ul className="hidden lg:flex gap-4 items-center h-full ">
                  {socialLinks.map((s) => (
                    <li key={s.label} className="hover:scale-125 transition-transform duration-300">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="hover:opacity-80 "
                      >
                        {s.icon}
                      </a>
                    </li>
                  ))}
                </ul>
                {/* Announcement Slider - always centered */}
                <div className="flex-1 flex justify-center">
                  <HeaderAnnouncementSlider />
                </div>
                {/* Right Spacer for symmetry (optional, can be empty or used for other icons) */}
                <div className="w-8" />
              </div>
            </div>
          )}
          {/* Existing Header */}
          <header
            className="fixed w-full block border-b border-[rgba(184,134,11,0.08)] bg-black text-[rgb(184,134,11,1)] z-50 transition-all duration-300"
            style={{
              top: showGoldBar ? "3rem" : "0",
              backgroundAttachment: "fixed",
              fontFamily: "Jost, sans-serif",
              fontStyle: "normal",
              fontWeight: 400,
              letterSpacing: "0.06rem",
              lineHeight: "calc(1 + 0.8 / 1.0)",
              fontSize: "0.5rem",
              height: "3rem",
            }}
          >
            {/* Mobile/Tablet Header Layout */}
            <div className="flex md:flex lg:hidden items-center justify-between max-w-[130rem] px-4 h-full w-full relative">
              {/* Hamburger Menu */}
              <button
                className="p-2 focus:outline-none"
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  // Reset mobile submenu state when opening/closing main mobile menu
                  if (mobileMenuOpen) {
                    setActiveMobileSubmenuIndex(null);
                    setMobileMenuTransitionDirection("");
                    setTempMobileSubmenuIndex(null); // Ensure temp is also reset
                  }
                }}
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="menu-drawer"
              >
                {mobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="w-5 h-7"
                    viewBox="0 0 18 17"
                  >
                    <path
                      fill="currentColor"
                      d="M.865 15.978a.5.5 0 0 0 .707.707l7.433-7.431 7.579 7.282a.501.501 0 0 0 .846-.37.5.5 0 0 0-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 1 0-.707-.708L8.991 7.853 1.413.573a.5.5 0 1 0-.693.72l7.563 7.268z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="w-5 h-7"
                    viewBox="0 0 18 16"
                  >
                    <path
                      fill="currentColor"
                      d="M1 .5a.5.5 0 1 0 0 1h15.71a.5.5 0 0 0 0-1zM.5 8a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1A.5.5 0 0 1 .5 8m0 7a.5.5 0 0 1 .5-.5h15.71a.5.5 0 0 1 0 1H1a.5.5 0 0 1-.5-.5"
                    />
                  </svg>
                )}
              </button>
              {/* Centered Logo */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full pointer-events-none">
                <a
                  href="https://ecobambo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 pointer-events-auto"
                >
                  <Image
                    src="/logo.png"
                    alt="ECO BAMBO"
                    width={70}
                    height={100}
                    className="object-contain"
                  />
                </a>
              </div>
              {/* Right: Search, Account, and Cart Icons (mobile/tablet) */}
              <div className="flex items-center gap-4 ml-auto pl-7 md:flex lg:hidden">
                <button
                  onClick={() => setShowSearch(true)}
                  className="hover:text-[rgb(184,134,11,1)]"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6"
                    fill="none"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M11.03 11.68A5.784 5.784 0 1 1 2.85 3.5a5.784 5.784 0 0 1 8.18 8.18m.26 1.12a6.78 6.78 0 1 1 .72-.7l5.4 5.4a.5.5 0 1 1-.71.7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <Link
                  href={getLinkHref("/cart")}
                  className="hover:text-[rgb(184,134,11,1)]"
                  aria-label="Cart"
                >
                  <svg
                    className="w-10 h-10 md:w-12 md:h-12"
                    fill="currentColor"
                    viewBox="0 0 40 40"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.75 11.8h-3.16l-.77 11.6a5 5 0 0 0 4.99 5.34h7.38a5 5 0 0 0 4.99-5.33L28.4 11.8zm0 1h-2.22l-.71 10.67a4 4 0 0 0 3.99 4.27h7.38a4 4 0 0 0 4-4.27l-.72-10.67h-2.22v.63a4.75 4.75 0 1 1-9.5 0zm8.5 0h-7.5v.63a3.75 3.75 0 1 0 7.5 0z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            {/* Desktop Header Layout (lg and up) */}
            <div className="hidden lg:flex items-center   justify-between max-w-[130rem] px-4 h-full w-full">
              {/* Logo on the left */}
              <div className="flex items-center">
                <a
                  href="https://ecobambo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center mt-2 gap-2"
                >
                  <img
                    src="/logo.png"
                    alt="ECO BAMBO"
                    width={140}
                    height={100}
                    className="object-contain"
                    loading="eager"
                  />
                </a>
              </div>
              {/* Menu in the center */}
              <nav className="flex-1 flex items-center ml-24 justify-start" id="desktop-header-menu-root">
                <ul className="flex gap-2" style={{ fontSize: "0.7rem" }}>
                  {menu.map((item, idx) =>
                    item.submenu ? (
                      <li
                        key={item.label}
                        className="relative"
                      >
                        <button
                          className="header__menu-item flex items-center px-4 py-2 font-dmsans font-semibold text-xs text-[rgb(184,134,11,0.8)] hover:text-[rgb(184,134,11,1)] hover:underline hover:decoration-[rgb(184,134,11,1)] focus:outline-none gap-1 whitespace-nowrap"
                          style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 300 }}
                          aria-expanded={openSubmenu === idx}
                          aria-controls={`desktop-submenu-${idx}`}
                          tabIndex={0}
                          onClick={() => setOpenSubmenu(openSubmenu === idx ? null : idx)}
                        >
                          <span>{item.label}</span>
                          <svg
                            className="icon icon-caret w-3 h-3"
                            viewBox="0 0 10 6"
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        {openSubmenu === idx && (
                          <ul
                            id={`HeaderMenu-MenuList-${idx}`}
                            className="header__submenu list-menu list-menu--disclosure color-scheme-1 gradient caption-large motion-reduce global-settings-popup absolute left-0 mt-2 w-44 pr-4 rounded-lg shadow-lg z-20 py-2 bg-white border border-[rgba(184,134,11,0.1)]"
                            role="list"
                            tabIndex={-1}
                          >
                            {item.submenu.map((sub) => (
                              <li key={sub.label}>
                                <a
                                  id={`HeaderMenu-${item.label
                                    .toLowerCase()
                                    .replace(/\s/g, "-")}-${sub.label
                                    .toLowerCase()
                                    .replace(/\s/g, "-")}`}
                                  href={getLinkHref(sub.href)}
                                  className="header__menu-item list-menu__item link link--text focus-inset caption-large flex w-full items-center px-4 py-2 font-dmsans font-medium text-[11px] text-left text-gray-700 rounded focus:outline-none hover:underline hover:decoration-black whitespace-nowrap"
                                  onClick={() => setOpenSubmenu(null)}
                                >
                                  {sub.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ) : (
                      <li
                        key={item.label}
                        className=""
                      >
                        <Link
                          href={getLinkHref(item.href)}
                          className={`header__menu-item flex items-center px-4 py-2 font-dmsans font-semibold text-xs 
                             ${
                               item.label === "Home"
                                 ? "text-[rgb(184,134,11,0.8)]"
                                 : "text-[rgb(184,134,11,0.8)]"
                             } 
                             whitespace-nowrap
                             `}
                          style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 300 }}
                          onClick={() => setOpenSubmenu(null)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </nav>
              {/* Icons on the right */}
              <div className="flex items-center gap-6 ml-auto">
                <button
                  onClick={() => setShowSearch(true)}
                  className="hover:text-[rgb(184,134,11,1)]"
                  aria-label="Search"
                >
                  <svg
                    className="w-5 h-5 hover:scale-125 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M11.03 11.68A5.784 5.784 0 1 1 2.85 3.5a5.784 5.784 0 0 1 8.18 8.18m.26 1.12a6.78 6.78 0 1 1 .72-.7l5.4 5.4a.5.5 0 1 1-.71.7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <Link
                  href={getLinkHref(
                    "https://shopify.com/60579741763/account?locale=en&region_country=PK"
                  )}
                  className="hover:text-[rgb(184,134,11,1)]"
                  rel="nofollow"
                  aria-label="Account"
                >
                  <svg
                    className="w-5 h-5 hover:scale-125 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 4.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8m5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15M9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href={getLinkHref("/cart")}
                  className="hover:text-[rgb(184,134,11,1)]"
                  aria-label="Cart"
                >
                  <svg
                    className="w-8 h-8 lg:w-12 lg:h-12 hover:scale-125 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 40 40"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.75 11.8h-3.16l-.77 11.6a5 5 0 0 0 4.99 5.34h7.38a5 5 0 0 0 4.99-5.33L28.4 11.8zm0 1h-2.22l-.71 10.67a4 4 0 0 0 3.99 4.27h7.38a4 4 0 0 0 4-4.27l-.72-10.67h-2.22v.63a4.75 4.75 0 1 1-9.5 0zm8.5 0h-7.5v.63a3.75 3.75 0 1 0 7.5 0z"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </header>
        </>
      )}
      {/* Mobile Menu Drawer */}
      {!showSearch && mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" style={{ top: "3rem" }}>
          <div
            className="fixed top-0 z-50 left-0 w-72 h-full bg-white shadow-lg p-6 overflow-y-auto border-r border-[rgba(184,134,11,0.1)] flex flex-col"
            style={{ top: "3rem" }}
          >
            <nav className="flex-1 relative overflow-x-hidden">
              <div className="w-full h-full relative">
                {/* Main menu */}
                <div
                  className={`absolute top-0 left-0 w-full transition-transform duration-300
                    ${
                      mobileMenuTransitionDirection === "forward"
                        ? "-translate-x-full"
                        : mobileMenuTransitionDirection === "backward"
                        ? "translate-x-0"
                        : activeMobileSubmenuIndex !== null
                        ? "-translate-x-full"
                        : "translate-x-0"
                    }`}
                  style={{ zIndex: activeMobileSubmenuIndex === null ? 2 : 1 }}
                >
                  <ul className="flex flex-col gap-1 text-black">
                    {menu.map((item, idx) =>
                      item.submenu ? (
                        <li key={item.label} className={idx === 0 ? "mt-12" : ""}>
                          <button
                            className="w-full text-left px-2 py-2 font-dmsans text-sm font-semibold text-black flex items-center justify-between whitespace-nowrap"
                            style={{
                              fontFamily: "DM Sans, sans-serif",
                              fontWeight: 600,
                            }}
                            onClick={() => openMobileSubmenu(idx)}
                          >
                            <span>{item.label}</span>
                            <span className="ml-1">→</span>
                          </button>
                        </li>
                      ) : (
                        <li key={item.label} className={idx === 0 ? "mt-12" : ""}>
                          <Link
                            href={getLinkHref(item.href)}
                            className="block px-2 py-2 font-dmsans text-sm font-semibold text-black whitespace-nowrap"
                            style={{
                              fontFamily: "DM Sans, sans-serif",
                              fontWeight: 600,
                            }}
                            onClick={() => setMobileMenuOpen(false)} // Close menu on direct link click
                          >
                            {item.label}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                {/* Submenu */}
                <div
                  className={`absolute top-0 left-0 w-full transition-transform duration-300
                    ${
                      mobileMenuTransitionDirection === "forward"
                        ? "translate-x-0"
                        : mobileMenuTransitionDirection === "backward"
                        ? "translate-x-full"
                        : activeMobileSubmenuIndex !== null
                        ? "translate-x-0"
                        : "translate-x-full"
                    }`}
                  style={{ zIndex: activeMobileSubmenuIndex !== null ? 2 : 1 }}
                >
                  {(activeMobileSubmenuIndex !== null ||
                    tempMobileSubmenuIndex !== null) && (
                    <div>
                      <button
                        className="mb-4 text-black font-semibold flex items-center mt-12"
                        onClick={goBackToMainMenu}
                      >
                        <span className="mr-2">←</span> Back
                      </button>
                      <ul className="flex flex-col gap-1 text-black">
                        {(
                          menu[
                            activeMobileSubmenuIndex !== null
                              ? activeMobileSubmenuIndex
                              : tempMobileSubmenuIndex
                          ]?.submenu || []
                        ).map((sub) => (
                          <li key={sub.label}>
                            <a
                              href={getLinkHref(sub.href)}
                              className="block px-2 py-2 font-dmsans text-sm font-semibold text-black whitespace-nowrap"
                              style={{
                                fontFamily: "DM Sans, sans-serif",
                                fontWeight: 600,
                              }}
                              onClick={() => setMobileMenuOpen(false)} // Close menu on submenu link click
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </nav>
            {/* Account and Cart icons at the bottom */}
            <div className="flex flex-col items-center gap-4 mt-8 pt-4 border-t border-gray-200 justify-center w-full mb-12">
              <div className="flex items-center gap-4">
                <a
                  href={getLinkHref(
                    "https://shopify.com/60579741763/account?locale=en&region_country=PK"
                  )}
                  className="p-2 hover:text-[#B8860B] text-black flex items-center justify-center"
                  rel="nofollow"
                  aria-label="Account"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 4.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8m5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15M9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href={getLinkHref("/cart")}
                  className="p-2 hover:text-[#B8860B] text-black flex items-center justify-center"
                  aria-label="Cart"
                >
                  <svg
                    className="w-12 h-12"
                    fill="currentColor"
                    viewBox="0 0 40 40"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.75 11.8h-3.16l-.77 11.6a5 5 0 0 0 4.99 5.34h7.38a5 5 0 0 0 4.99-5.33L28.4 11.8zm0 1h-2.22l-.71 10.67a4 4 0 0 0 3.99 4.27h7.38a4 4 0 0 0 4-4.27l-.72-10.67h-2.22v.63a4.75 4.75 0 1 1-9.5 0zm8.5 0h-7.5v.63a3.75 3.75 0 1 0 7.5 0z"
                    />
                  </svg>
                </a>
              </div>
              {/* Social Icons Row */}
              <div className="flex items-center gap-4 mt-4">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="hover:opacity-80 text-black"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* Overlay click closes menu and resets submenu */}
          <div
            className="fixed inset-0 z-40"
            style={{ top: "3rem" }}
            onClick={() => {
              setMobileMenuOpen(false);
              setActiveMobileSubmenuIndex(null);
              setMobileMenuTransitionDirection("");
              setTempMobileSubmenuIndex(null);
            }}
          />
        </div>
      )}
    </>
  );
}