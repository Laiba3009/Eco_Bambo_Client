import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { shopifyFetch } from "../lib/shopify";

// Transformed product interface for display
interface Product {
  id: string;
  name: string;
  handle: string;
  price: string;
  image: string;
  description: string;
  tags: string[];
  productType?: string;
}

// ProductCard Component - Basic styling for each product item
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
  const reviewCount = Math.floor(Math.random() * 30) + 15; // 15-45 reviews

  // Shopify product URL (replace with your domain)
  const shopifyDomain = "https://ecobambo.com"; // <-- Change this
  const productUrl = `${shopifyDomain}/products/${product.handle}`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden text-center my-2 mx-4
                    w-[250px] h-[380px] flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">

      {/* Product Image */}
      <a href={productUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-xl cursor-pointer hover:scale-105 transition-transform duration-300"
        />
      </a>

      <div className="p-4 flex-1 flex flex-col">
        {/* Product Title */}
        <a href={productUrl} target="_blank" rel="noopener noreferrer">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
            {product.name}
          </h3>
        </a>
        
        {/* Star Rating */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex text-yellow-400 text-sm">
            {Array(5).fill(null).map((_, i) => (
              <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-2">({reviewCount})</span>
        </div>
        
        {/* Price */}
        <p className="text-lg font-bold text-green-600 mb-3">{product.price}</p>
        
        {/* Product Type Badge */}
        {product.productType && (
          <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full mt-auto">
            {product.productType}
          </span>
        )}
        
        {/* View Details Button */}
        <a href={productUrl} target="_blank" rel="noopener noreferrer" className="mt-3">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
            View Product
          </button>
        </a>
      </div>
    </div>
  );
};

// AnimatedProductCard Component
interface AnimatedProductCardProps {
  product: Product;
  index: number;
  currentIndex: number;
  totalSlides: number;
}

const AnimatedProductCard: React.FC<AnimatedProductCardProps> = ({ product, index, currentIndex, totalSlides }) => {
  let opacity = 1;
  let scale = 1;

  const distance = index - currentIndex;
  const halfLength = totalSlides / 2;

  let effectiveDistance;
  if (Math.abs(distance) <= halfLength) {
    effectiveDistance = distance;
  } else if (distance > halfLength) {
    effectiveDistance = distance - totalSlides;
  } else {
    effectiveDistance = distance + totalSlides;
  }

  if (effectiveDistance === 0) {
    opacity = 1;
    scale = 1.05;
  } else if (Math.abs(effectiveDistance) === 1) {
    opacity = 0.7;
    scale = 0.95;
  } else if (Math.abs(effectiveDistance) === 2) {
    opacity = 0.4;
    scale = 0.9;
  } else {
    opacity = 0.1;
    scale = 0.8;
  }

  return (
    <motion.div
      className="flex justify-center items-center h-full"
      style={{ opacity, scale }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ProductCard product={product} />
    </motion.div>
  );
};

// Main Component
const RelatedProducts2 = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Fetch products from Shopify
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await shopifyFetch({
          query: `
            query GetProducts($first: Int!) {
              products(first: $first) {
                edges {
                  node {
                    id
                    title
                    handle
                    description
                    images(first: 1) {
                      edges {
                        node {
                          src
                          altText
                        }
                      }
                    }
                    variants(first: 1) {
                      edges {
                        node {
                          priceV2 {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                    tags
                    productType
                  }
                }
              }
            }
          `,
          variables: { first: 20 },
        });

        if (!data.products || !data.products.edges) {
          throw new Error("No products data received");
        }

        const transformedProducts = data.products.edges
          .map((edge: { node: any }) => {
            const node = edge.node;
            return {
              id: node.id,
              name: node.title,
              handle: node.handle,
              price: `${node.variants.edges[0]?.node.priceV2.currencyCode || ""} ${node.variants.edges[0]?.node.priceV2.amount || "N/A"}`,
              image: node.images.edges[0]?.node.src || "/images/placeholder.jpg",
              description: node.description,
              tags: node.tags || [],
              productType: node.productType
            };
          })
          .filter((product: { image: string; price: string }) => {
            if (!product.image || product.image === "/images/placeholder.jpg") return false;
            if (product.price.includes("N/A")) return false;
            return true;
          })
          .slice(0, 8);

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentSlideIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect(); 
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-inter">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading products from Shopify...</p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-inter">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || "No products available"}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-inter">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black my-10"
      >
        Related Products
      </motion.h2>
    
      <div className="w-full max-w-7xl relative">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {products.map((product, index) => (
              <div key={product.id} className="embla__slide flex justify-center items-center">
                <AnimatedProductCard 
                  product={product} 
                  index={index} 
                  currentIndex={currentSlideIndex} 
                  totalSlides={products.length}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Custom Navigation Arrows */}
        <button 
          className="embla__button embla__button--prev bg-gray-700 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg 
                     absolute top-1/2 -left-12 -translate-y-1/2 z-10"
          onClick={scrollPrev}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button 
          className="embla__button embla__button--next bg-gray-700 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg 
                     absolute top-1/2 -right-12 -translate-y-1/2 z-10"
          onClick={scrollNext}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>

        {/* Embla dots */}
        <div className="embla__dots flex justify-center mt-4">
          {products.map((_, idx) => (
            <button
              key={idx}
              className={`embla__dot w-3 h-3 rounded-full mx-1 transition-colors duration-300
                          ${idx === currentSlideIndex ? 'bg-gray-800' : 'bg-gray-400 hover:bg-gray-600'}`}
              onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts2;
