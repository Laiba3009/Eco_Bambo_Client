"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

// Product interface
interface Product {
  id: string;
  name: string;
  link: string;
  image: string;
  productType?: string;
}

// Product Card UI
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden text-center
                    w-[240px] h-[330px] flex flex-col justify-between
                    hover:shadow-lg transition-shadow shrink-0 mx-3">

      {/* Image */}
      <a href={product.link} target="_blank" rel="noopener noreferrer">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover cursor-pointer"
        />
      </a>

      <div className="p-3 flex-1 flex flex-col">
        {/* Title */}
        <a href={product.link} target="_blank" rel="noopener noreferrer">
          <h3 className="text-base font-semibold mb-2 text-gray-800 line-clamp-2">
            {product.name}
          </h3>
        </a>

        {/* Product Type (optional) */}
        {product.productType && (
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full mb-2">
            {product.productType}
          </span>
        )}

        {/* Button */}
        <a href={product.link} target="_blank" rel="noopener noreferrer" className="mt-auto">
          <button className="w-full bg-[#b8860b] text-white py-2 rounded-md hover:bg-black transition-colors text-sm">
            View Product
          </button>
        </a>
      </div>
    </div>
  );
};

// MAIN SLIDER
const RelatedProducts4 = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // ✅ MANUAL 8 PRODUCTS
  const products: Product[] = [
    {
      id: "1",
      name: "Modern Bamboo Baby Chair – Eco-Friendly Seating",
      image: "/images/sil4.jpg",
      link: "https://ecobambo.com/products/modern-bamboo-baby-chair-master-everyday-chair-visitor",
    },
    {
      id: "2",
      name: "Handmade Bamboo Fence for Outdoor & Garden – Perfect Touch",
      image: "/images/sil5.jpg",
      link: "https://ecobambo.com/products/handmade-bamboo-fence",
    },
    {
      id: "3",
      name: "Covered Bamboo Swing – Relax in Style with Shade",
      image: "/images/sil6.jpg",
      link: "https://ecobambo.com/products/outdoor-bamboo-swings-for-toddlers",
    },
    {
      id: "4",
      name: "Garden Ke Liye Bamboo Chair – Nature Ka Touch!",
      image: "/images/sil7.jpg",
      link: "https://ecobambo.com/products/garden-ke-liye-bamboo-chair-nature-ka-touch",
    },
    {
      id: "5",
      name: "Handmade Bamboo Shade for Car Parking with 10–15 Years Lifespan",
      image: "/images/col1.jpg",
      link: "https://ecobambo.com/products/handmade-bamboo-shade-for-car-parking",
    },
      
    {
      id: "6",
      name: "Spacious Bamboo Canopy with Multi-Purpose Use",
      image: "/images/col3.jpg",
      link: "https://ecobambo.com/products/spacious-bamboo-canopy-with-multi-purpose-use",
    },
    {
      id: "7",
      name: "Luxurious Bamboo Beds for Ultimate Comfort",
      image: "/images/col4.jpg",
      link: "https://ecobambo.com/products/luxurious-bamboo-beds-for-ultimate-comfort",
    },
  ];

  // FIXED useEffect (No TypeScript Error)
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlideIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6 relative">

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black my-10"
      >
        Related Products
      </motion.h2>

      {/* Slider */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex -mx-3">
          {products.map((product) => (
            <div key={product.id} className="embla__slide">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <button
        className="absolute top-1/2 -left-8 -translate-y-1/2 bg-[#b8860b] text-white p-3 rounded-full shadow hover:bg-gray-800"
        onClick={scrollPrev}
      >
        ‹
      </button>

      <button
        className="absolute top-1/2 -right-8 -translate-y-1/2 bg-[#b8860b] text-white p-3 rounded-full shadow hover:bg-gray-800"
        onClick={scrollNext}
      >
        ›
      </button>

      {/* Dots */}
      <div className="flex justify-center mt-6">
        {products.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 mx-1 rounded-full ${
              idx === currentSlideIndex ? "bg-black" : "bg-gray-400"
            }`}
            onClick={() => emblaApi?.scrollTo(idx)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts4;
