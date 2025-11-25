"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  image: string;
  link: string;
}

const RelatedProducts3: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    setShowTitle(true);
  }, []);

  // Auto slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const el = scrollRef.current;
        const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

        if (isAtEnd) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Manual Products Data
  const products: Product[] = [
    {
      id: "1",
      name: "Handmade Bamboo Shade for Car Parking with 10-15 Years Lifespan",
      image: "/images/col1.jpg",
      link: "https://ecobambo.com/products/handmade-bamboo-shade-for-car-parking",
    },
    {
      id: "2",
      name: "Bamboo Wall Design for a Sustainable Home Makeover",
      image: "/images/col2.jpg",
      link: "https://ecobambo.com/products/bamboo-wall-design",
    },
    {
      id: "3",
      name: "Spacious Bamboo Canopy with Multi-Purpose Use",
      image: "/images/col3.jpg",
      link: "https://ecobambo.com/products/spacious-bamboo-canopy-with-multi-purpose-use",
    },
    {
      id: "4",
      name: "Luxurious Bamboo Beds for Ultimate Comfort",
      image: "/images/col4.jpg",
      link: "https://ecobambo.com/products/luxurious-bamboo-beds-for-ultimate-comfort",
    },
    {
      id: "5",
      name: "Bambo House - Excellence in Eco-Friendly Hospitality",
      image: "/images/col5.jpg",
      link: "https://ecobambo.com/products/bamboo-treehouse-with-unique-design",
    },
    {
      id: "6",
      name: "Modern Bamboo Plant Stand – Elegant and Sustainable",
      image: "/images/col6.jpg",
      link: "https://ecobambo.com/products/bamboo-ka-modern-plant-stands",
    },
    {
      id: "7",
      name: "Garden Ke Liye Bamboo Chair – Nature Ka Touch!",
      image: "/images/sil7.jpg",
      link: "https://ecobambo.com/products/garden-ke-liye-bamboo-chair-nature-ka-touch",
    },
  ];

  return (
    <section className="w-full py-12 px-4">
      <.h2motion
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: showTitle ? 1 : 0, y: showTitle ? 0 : -30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black my-10"
      >
        Related Products
      </motion.h2>

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll space-x-4 pb-6 scrollbar-hide snap-x snap-mandatory"
      >
        {products.map((product, index) => (
          <motion.div
  key={product.id}
  className="
    flex-none
    w-[230px] sm:w-[240px] md:w-[260px] lg:w-[300px]
    bg-white rounded-xl shadow-md overflow-hidden snap-center
    cursor-pointer transform transition-transform duration-300
    hover:scale-105
  "
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1, duration: 0.5 }}
>
  <a href={product.link} target="_blank" rel="noopener noreferrer">
    <div className="w-full h-[190px] sm:h-[200px] md:h-[220px] overflow-hidden rounded-lg mb-2">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover"
      />
    </div>
  </a>

  <div className="p-3">
    <a href={product.link} target="_blank" rel="noopener noreferrer">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 truncate hover:text-indigo-600 transition-colors">
        {product.name}
      </h3>
    </a>
  </div>
</motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts3;
