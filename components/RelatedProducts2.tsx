"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RelatedProducts = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const [showTitle, setShowTitle] = useState(false);
  useEffect(() => setShowTitle(true), []);

  const products = [
    { id: "1", name: "Premium Bamboo Gazebo for Garden and Outdoor Stylish Bamboo Pavilion & Pergola", image: "/images/sil1.jpg", link: "https://ecobambo.com/products/bamboo-gazebo-with-open-air-design" },
    { id: "2", name: "Modern Living Room Ke Liye Elegant Bamboo Sofa Set", image: "/images/sil2.jpg", link: "https://ecobambo.com/products/modern-living-room-ke-liye-elegant-bamboo-sofa-set" },
    { id: "3", name: "Premium Bamboo Single Bed for Kids with Canopy Design", image: "/images/sil3.jpg", link: "https://ecobambo.com/products/bamboo-single-beds-for-kids" },
    { id: "4", name: "Modern Bamboo Baby Chair – Eco-Friendly Seating", image: "/images/sil4.jpg", link: "https://ecobambo.com/products/modern-bamboo-baby-chair-master-everyday-chair-visitor" },
    { id: "5", name: "Handmade Bamboo Fence for Outdoor & Garden – Perfect Touch", image: "/images/sil5.jpg", link: "https://ecobambo.com/products/handmade-bamboo-fence" },
    { id: "6", name: "Covered Bamboo Swing – Relax in Style with Shade", image: "/images/sil6.jpg", link: "https://ecobambo.com/products/outdoor-bamboo-swings-for-toddlers" },
    { id: "7", name: "Garden Ke Liye Bamboo Chair – Nature Ka Touch!", image: "/images/sil7.jpg", link: "https://ecobambo.com/products/garden-ke-liye-bamboo-chair-nature-ka-touch" },
  ];

  return (
    <div className="relative w-full py-12 bg-white">
      {/* Animated Title */}
      <h1
        className={`
          text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-10 transition-all duration-700
          ${showTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        Related Products
      </h1>

      {/* Left Button */}
      <button
        onClick={scrollPrev}
        className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 sm:p-3 rounded-full hover:bg-[#b8860b] transition z-10"
      >
        <ChevronLeft size={20} className="sm:hidden" />
        <ChevronLeft size={26} className="hidden sm:block" />
      </button>

      {/* Right Button */}
      <button
        onClick={scrollNext}
        className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 sm:p-3 rounded-full hover:bg-[#b8860b] transition z-10"
      >
        <ChevronRight size={20} className="sm:hidden" />
        <ChevronRight size={26} className="hidden sm:block" />
      </button>

      {/* Slider */}
      <div className="overflow-hidden w-full px-[5px]" ref={emblaRef}>
        <div className="flex gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="
                flex-none
                w-[350px] sm:w-[300px] md:w-[400px] lg:w-[500px]
                bg-white p-3 rounded-xl  
                hover:scale-[1.02]
                transition duration-300 cursor-pointer
              "
            >
              <a href={product.link} target="_blank">
                <div className="w-full h-[270px] sm:h-[250px] md:h-[390px] rounded-lg overflow-hidden mb-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-sm sm:text-sm md:text-base font-semibold text-left truncate">
                  {product.name}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
