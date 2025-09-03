import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  "/images/big-p2.png",
  "/images/big-p1.png",
  "/images/big-p.png",
];

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Slide
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full flex  justify-center bg-gradient-to-r from-gray-100 to-gray-200 py-10">
      <div className="relative w-[80%] h-[400px] overflow-hidden rounded-xl shadow-lg bg-white">
        <div
          key={currentIndex} // this forces re-render animation
          className="w-full h-full transition-opacity duration-1000 ease-in-out"
        >
          <img
            src={images[currentIndex]}
            alt="Banner"
            className="w-full h-full object-cover animate-fade-slide"
          />
        </div>

        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300"
        >
          <FaChevronLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300"
        >
          <FaChevronRight size={20} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
