import React from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Typewriter from "typewriter-effect";

const App = () => {
  const images = [
    {
      id: 1,
      src: "/images/b-g3.png",
      alt: "Large Hanging Wall",
      width: "w-[700px]",
      link: "/products/1-unique-bamboo-wall-hanging-affordable-home-wall-art-decor-in-small-sizes-for-living-areas",
    },
    {
      id: 2,
      src: "/images/small-wall.jpg",
      alt: "Small Hanging Wall",
      width: "w-[500px]",
      link: "/products/small-bamboo-hanging-with-stand-stylish-home-wall-art-decor",
    },
    {
      id: 3,
      src: "/images/banner-2-3.jpeg",
      alt: "Big Bamboo Pot",
      width: "w-[500px]",
      link: "/products/big-bamboo-pot",
    },
    {
      id: 4,
      src: "/images/banner-3-3.jpeg",
      alt: "Small Bamboo Flower Pot",
      width: "w-[700px]",
      link: "/products/big-red-bamboo-flower-pot",
    },
  ];

  // Slide-in variant for staggered entrance
  const slideInVariant: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.7,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center mb-9 font-sans">
      {/* Typewriter Title */}
      <h2 className="text-xl sm:text-2xl md:text-4xl font-semibold text-center mb-8 text-black">
        <Typewriter
          options={{
            strings: ["Coastal Farmhouse Decor House Plants for Sale!"],
            autoStart: true,
            loop: true,
            delay: 10,
          }}
        />
      </h2>

      {/* Image Grid */}
      <motion.div
        className="flex flex-wrap justify-center w-full"
        initial="hidden"
        animate="visible"
      >
        {images.map((image, i) => (
          <Link href={image.link} key={image.id}>
            <motion.div
              className={`
                relative overflow-hidden shadow-2xl cursor-pointer group bg-white border-2 border-white
                ${image.width} h-[370px] flex items-center justify-center
              `}
              custom={i}
              variants={slideInVariant}
              whileHover={{ scale: 1.03, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-[360px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/400x250/CCCCCC/000000?text=Image+Load+Error";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-lg font-semibold text-center text-white">
                  {image.alt}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default App;
