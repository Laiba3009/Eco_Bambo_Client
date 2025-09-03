import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Custom Typewriter component
type CustomTypewriterProps = {
  strings: string[];
  delay?: number;
  loop?: boolean;
};

const CustomTypewriter: React.FC<CustomTypewriterProps> = ({
  strings,
  delay = 10,
  loop = true,
}) => {
  const [text, setText] = useState("");
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentString = strings[stringIndex];
    let timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText(currentString.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        if (charIndex === 0) {
          setIsDeleting(false);
          setStringIndex((prev) => (prev + 1) % strings.length);
        }
      }, delay / 2);
    } else {
      timeout = setTimeout(() => {
        setText(currentString.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        if (charIndex === currentString.length) {
          if (loop) {
            setIsDeleting(true);
          }
        }
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, stringIndex, strings, delay, loop]);

  return <span>{text}</span>;
};

// Animation Variants
const slideInVariant = {
  hidden: { opacity: 0, y: 100 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

const App = () => {
  const images = [
    {
      id: 1,
      src: "/images/b-g1.png",
      alt: "Bamboo Flower Pot Collection",
      link: "https://ecobambo.com/products/small-bamboo-flower-pot-with-stand-stylish-indoor-artificial-pot",
      buttonText: "Shop Now",
    },
    {
      id: 2,
      src: "/images/pot-banner.jpg",
      alt: "Bamboo Hanging Decor",
      link: "https://ecobambo.com/products/large-bamboo-standing-plant-pot-unique-affordable",
      buttonText: "Shop Now",
    },
    {
      id: 3,
      src: "/images/b-g3.png",
      alt: "Unique Bamboo Wall Hanging",
      link: "https://ecobambo.com/products/1-unique-bamboo-wall-hanging-affordable-home-wall-art-decor-in-small-sizes-for-living-areas",
      buttonText: "Shop Now",
    },
  ];

  return (
    <section className="px-0 py-0 bg-white mb-5 min-h-screen flex items-center justify-center font-sans">
      <div className="max-w-[1300px] mx-auto w-full">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 text-black">
          <CustomTypewriter
            strings={["Fresh Decor & Greenery for Your Home!"]}
            delay={70}
            loop={true}
          />
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-2">
          {/* Two Equal Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Left Image */}
            <motion.a
              href={images[1].link}
              target="_blank"
              rel="noopener noreferrer"
              custom={1}
              variants={slideInVariant as any}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="relative group h-[250px] md:h-[320px] overflow-hidden rounded-xl shadow-lg block bg-gray-100"
            >
              <img
                src={images[1].src}
                alt={images[1].alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://placehold.co/600x400/CCCCCC/000000?text=Image+Error`;
                }}
              />
              <span className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-gray-800 text-white font-semibold transition-all duration-300 opacity-0 group-hover:opacity-100 text-sm">
                {images[1].buttonText}
              </span>
            </motion.a>

            {/* Right Image */}
            <motion.a
              href={images[2].link}
              target="_blank"
              rel="noopener noreferrer"
              custom={2}
              variants={slideInVariant as any}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              className="relative group h-[250px] md:h-[320px] overflow-hidden rounded-xl shadow-lg block bg-gray-100"
            >
              <img
                src={images[2].src}
                alt={images[2].alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://placehold.co/600x400/CCCCCC/000000?text=Image+Error`;
                }}
              />
              <span className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-gray-800 text-white font-semibold transition-all duration-300 opacity-0 group-hover:opacity-100 text-sm">
                {images[2].buttonText}
              </span>
            </motion.a>
          </div>

          {/* Large Promo Image */}
          <motion.a
            href={images[0].link}
            target="_blank"
            rel="noopener noreferrer"
            custom={0}
            variants={slideInVariant as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="relative group h-[480px] md:h-[550px] overflow-hidden rounded-xl shadow-lg block bg-gray-100"
          >
            <img
              src={images[0].src}
              alt={images[0].alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/1200x500/CCCCCC/000000?text=Image+Error`;
              }}
            />
            <span className="absolute bottom-5 left-4 px-4 py-2 rounded-full bg-gray-800 text-white font-semibold transition-all duration-300 opacity-0 group-hover:opacity-100 text-base">
              {images[0].buttonText}
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default App;
