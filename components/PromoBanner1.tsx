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
      link: "/products/1-unique-bamboo-wall-hanging-affordable-home-wall-art-decor-in-small-sizes-for-living-areas",
    },
    {
      id: 2,
      src: "/images/small-wall.jpg",
      alt: "Small Hanging Wall",
      link: "/products/small-bamboo-hanging-with-stand-stylish-home-wall-art-decor",
    },
    {
      id: 3,
      src: "/images/banner-2-3.jpeg",
      alt: "Big Bamboo Pot",
      link: "/products/large-bamboo-standing-plant-pot-unique-affordable",
    },
    {
      id: 4,
      src: "/images/banner-3-3.jpeg",
      alt: "Small Bamboo Flower Pot",
      link:  "/products/small-bamboo-flower-pot-with-stand-stylish-indoor-artificial-pot",
    },
  ];

  // Slide-in animation
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center mb-9 font-sans px-4">
      {/* ✅ Typewriter Title */}
      <h2 className="text-lg sm:text-2xl md:text-4xl font-semibold text-center mb-8 text-black">
        <Typewriter
          options={{
            strings: ["Coastal Farmhouse Decor House Plants for Sale!"],
            autoStart: true,
            loop: true,
            delay: 10,
          }}
        />
      </h2>

      {/* ✅ Responsive Image Grid */}
      <motion.div
        className="flex flex-wrap justify-center gap-6 w-full max-w-[1400px]"
        initial="hidden"
        animate="visible"
      >
        {images.map((image, i) => (
          <Link href={image.link} key={image.id}>
            <motion.div
              className="
                relative overflow-hidden shadow-2xl cursor-pointer group bg-white border-2 border-white
                w-full sm:w-[90%] md:w-[500px] lg:w-[600px] xl:w-[700px]
                h-[220px] sm:h-[280px] md:h-[320px] lg:h-[370px]
                flex items-center justify-center
              "
              custom={i}
              variants={slideInVariant}
              whileHover={{ scale: 1.03, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://placehold.co/400x250/CCCCCC/000000?text=Image+Load+Error";
                }}
              />
              {/* ✅ Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-center text-white px-2">
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
