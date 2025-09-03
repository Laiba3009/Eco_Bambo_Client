import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
// Make sure to install Glide.js by running: npm install @glidejs/glide
import Glide from '@glidejs/glide';
import '@glidejs/glide/dist/css/glide.core.min.css';
import '@glidejs/glide/dist/css/glide.theme.min.css';

// Sample product data
const products = [
  { id: 1, name: 'Elegant Watch', price: '$199.99', image: 'https://placehold.co/250x350/FF5733/FFFFFF?text=Watch+1' },
  { id: 2, name: 'Stylish Backpack', price: '$79.99', image: 'https://placehold.co/250x350/C70039/FFFFFF?text=Backpack+2' },
  { id: 3, name: 'Wireless Headphones', price: '$129.99', image: 'https://placehold.co/250x350/900C3F/FFFFFF?text=Headphones+3' },
  { id: 4, name: 'Smart Fitness Tracker', price: '$49.99', image: 'https://placehold.co/250x350/581845/FFFFFF?text=Tracker+4' },
  { id: 5, name: 'Vintage Camera', price: '$299.99', image: 'https://placehold.co/250x350/FFC300/000000?text=Camera+5' },
  { id: 6, name: 'Noise-Cancelling Earbuds', price: '$99.99', image: 'https://placehold.co/250x350/DAF7A6/000000?text=Earbuds+6' },
  { id: 7, name: 'Portable Bluetooth Speaker', price: '$69.99', image: 'https://placehold.co/250x350/FF5733/FFFFFF?text=Speaker+7' },
  { id: 8, name: 'Classic Sunglasses', price: '$89.99', image: 'https://placehold.co/250x350/C70039/FFFFFF?text=Sunglasses+8' },
];

// ProductCard Component - Basic styling for each product item
type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden text-center m-2
                  w-[250px] h-[350px] flex flex-col justify-between">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-3/4 object-cover rounded-t-xl"
    />
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-1 text-gray-800">{product.name}</h3>
      <p className="text-lg text-gray-600">{product.price}</p>
    </div>
  </div>
);

// AnimatedProductCard Component - Applies tilt animation based on position
interface AnimatedProductCardProps {
  product: Product;
  index: number;
  currentIndex: number;
  totalSlides: number;
}

const AnimatedProductCard: React.FC<AnimatedProductCardProps> = ({ product, index, currentIndex, totalSlides }) => {
  let tilt = 0;
  let scale = 1;

  // Calculate the effective distance considering the infinite loop for a smoother transition
  // This logic is crucial for continuous tilt on infinite carousels
  const distance = index - currentIndex;
  const halfLength = totalSlides / 2;

  let effectiveDistance;
  if (Math.abs(distance) <= halfLength) {
    effectiveDistance = distance;
  } else if (distance > halfLength) {
    effectiveDistance = distance - totalSlides;
  } else { // distance < -halfLength
    effectiveDistance = distance + totalSlides;
  }

  if (effectiveDistance === 0) {
    // Center item
    tilt = 0;
    scale = 1.05; // Slightly larger for emphasis
  } else if (effectiveDistance === -1) {
    // Immediately left item
    tilt = 10;
    scale = 0.95; // Slightly smaller
  } else if (effectiveDistance === 1) {
    // Immediately right item
    tilt = -10;
    scale = 0.95; // Slightly smaller
  } else if (effectiveDistance < -1) {
    // Further left items
    tilt = 15;
    scale = 0.9;
  } else if (effectiveDistance > 1) {
    // Further right items
    tilt = -15;
    scale = 0.9;
  }

  return (
    <motion.div
      className="flex justify-center items-center"
      animate={{ rotateY: tilt, scale }}
      transition={{ duration: 0.4 }}
      style={{
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
    >
      <ProductCard product={product} />
    </motion.div>
  );
};

// Main Glider Component
const Glider = () => {
  const glideRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (glideRef.current) {
      const glide = new Glide(glideRef.current, {
        type: 'carousel', // 'carousel' for infinite loop
        perView: 5,      // Shows 5 products in the bar
        focusAt: 'center', // Keep the current slide centered
        gap: 20,         // Gap between slides
        autoplay: 3000,  // Auto-play speed
        animationDuration: 500, // Animation speed
        breakpoints: {
          1024: {
            perView: 3
          },
          768: {
            perView: 1
          }
        }
      });

      const computeFocusedIndex = () => {
        const perView = Number(glide.settings.perView) || 1;
        const focusAt = glide.settings.focusAt;
        const offset = typeof focusAt === 'number' ? focusAt : Math.floor(perView / 2);
        let idx = (glide.index + offset) % products.length;
        if (idx < 0) idx += products.length;
        setFocusedIndex(idx);
      };

      glide.on('mount.after', computeFocusedIndex);
      glide.on('run.after', computeFocusedIndex);

      glide.mount();

      // Cleanup on unmount
      return () => {
        glide.destroy();
      };
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 
                    flex flex-col items-center justify-center p-4 font-inter">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 
                     text-center leading-tight rounded-lg p-3">
        Featured Products ✨
      </h1>
      <div className="w-full max-w-7xl">
        <div ref={glideRef} className="glide">
          <div className="glide__track" data-glide-el="track">
            <ul className="glide__slides">
              {products.map((product, index) => (
                <li key={product.id} className="glide__slide">
                  <AnimatedProductCard 
                    product={product} 
                    index={index} 
                    currentIndex={focusedIndex} 
                    totalSlides={products.length}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Carousel Controls */}
          <div className="glide__arrows" data-glide-el="controls">
            <button className="glide__arrow glide__arrow--left bg-gray-700 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg 
                                 absolute top-1/2 -left-12 -translate-y-1/2 z-10 
                                 transition-colors duration-300" 
                    data-glide-dir="<">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button className="glide__arrow glide__arrow--right bg-gray-700 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg 
                                  absolute top-1/2 -right-12 -translate-y-1/2 z-10 
                                  transition-colors duration-300" 
                    data-glide-dir=">">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Carousel Dots (optional) */}
          <div className="glide__bullets" data-glide-el="controls[nav]">
            {products.map((_, index) => (
              <button 
                key={index} 
                className="glide__bullet bg-gray-400 hover:bg-gray-600 w-3 h-3 rounded-full mx-1 
                           transition-colors duration-300" 
                data-glide-dir={`=${index}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Glider;
