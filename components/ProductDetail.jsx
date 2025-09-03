import React, { useEffect, useState } from "react";
import ImageSlider from "./ImageSlider";
import AddToCart from "./AddToCart";
import TextSlider from "./TextSlider";
import Accordion from "./Accordion";
import { FaShippingFast } from "react-icons/fa";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetch("/data/product.json")
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setSelectedVariant(data.variants[0]);
        setCurrentImage(data.variants[0].image);
      });
  }, []);

  if (!product || !selectedVariant) return null;

  const handleColorClick = (variant) => {
    setSelectedVariant(variant);
    setCurrentImage(variant.image);
  };

  return (
    <>
      {/* Container with reduced padding and better mobile support */}
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

        {/* Left - ImageSlider */}
        <ImageSlider
          images={product.images}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
        />

        {/* Right - Product Info */}
        <div className="flex flex-col space-y-4">
          {/* Title */}
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#000000] font-albert leading-tight">
            {product.title}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-2">
            <div className="flex text-[#000000] text-base sm:text-lg">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <span key={i}>★</span>
                ))}
            </div>
            <p className="text-sm sm:text-base text-black">{product.ratings}</p>
          </div>

          {/* Note */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-red-500 text-lg">⚡</span>
            <p className="text-lg sm:text-[24px] text-[#000000] font-jost">{product.note}</p>
          </div>

          {/* Price Block */}
          <div className="flex flex-wrap items-center gap-4 text-lg sm:text-xl font-bold text-[#000000] font-albert">
            <span>{product.price}</span>
            <span className="line-through text-gray-400">{product.originalPrice}</span>
            <span className="bg-[#0167FF] text-white text-xs px-2 py-1 rounded-lg">
              {product.discount}
            </span>
          </div>

          {/* Delivery Info */}
          <p className="text-sm sm:text-md text-gray-600 flex items-center gap-2">
            <FaShippingFast className="text-black" />
            {product.deliveryEstimate}
          </p>

          {/* Color Selector */}
          <div>
            <h2 className="font-albert mb-2 text-sm text-black sm:text-base font-semibold">Color</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.variants.map((variant, index) => (
                <img
                  key={index}
                  src={variant.image}
                  alt={variant.color}
                  title={variant.color}
                  onClick={() => handleColorClick(variant)}
                  className={`w-10 h-10 object-cover bg-white rounded-full border-2 cursor-pointer ${
                    variant.color === selectedVariant.color
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-700">{selectedVariant.color}</p>

            {/* Add to Cart Component */}
            <AddToCart product={product} selectedVariant={selectedVariant} />
          </div>
        </div>
      </div>

      {/* Accordion Section */}
      <Accordion product={product} />

      {/* Text Slider */}
      <TextSlider />
    </>
  );
};

export default ProductDetail;
