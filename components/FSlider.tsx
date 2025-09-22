import React, { useState, useEffect } from "react";
import Typewriter from "typewriter-effect";
import { FiShoppingBag } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { shopifyFetch } from "../lib/shopify";

const FSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // GraphQL query to fetch products
  const PRODUCTS_QUERY = `
    query GetPopularProducts($first: Int!) {
      products(first: $first, sortKey: BEST_SELLING) {
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
  `;

  // Fetch products from Shopify
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await shopifyFetch({
          query: PRODUCTS_QUERY,
          variables: { first: 12 },
        });
        
        const fetchedProducts = data.products.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
          description: edge.node.description,
          image: edge.node.images.edges[0]?.node.src || "/images/placeholder.jpg",
          altText: edge.node.images.edges[0]?.node.altText || edge.node.title,
          price: edge.node.variants.edges[0]?.node.priceV2.amount || "N/A",
          currency: edge.node.variants.edges[0]?.node.priceV2.currencyCode || "",
          tags: edge.node.tags,
          productType: edge.node.productType
        }));
        
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Dynamically detect screen size
  useEffect(() => {
    const updateItems = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsPerPage(1); // mobile
      else if (width < 768) setItemsPerPage(2); // tablet
      else if (width < 1024) setItemsPerPage(3); // small desktop
      else setItemsPerPage(4); // large desktop
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(products.length - itemsPerPage, prev + itemsPerPage)
    );
  };

  // Touch event handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext(); // swipe left
      else handlePrev(); // swipe right
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const visibleItems = products.slice(currentIndex, currentIndex + itemsPerPage);

  if (loading) {
    return (
      <section className="bg-gray-50 py-12 px-4 relative">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading popular products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-12 px-4 relative">
        <div className="text-center text-red-600">
          <p>Error loading products: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12 px-4 relative">
      {/* Typewriter Title */}
      <h2 className="text md:text-4xl text-black font-semibold text-center mt-4 mb-1">
        <Typewriter
          options={{
            strings: ["Explore Full Collection >"],
            autoStart: true,
            loop: true,
            delay: 50,
          }}
        />
      </h2>

      {/* Main Heading */}
      <motion.h3
        className="text-2xl mt-2 md:text-5xl text-center font-bold text-gray-800 mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        All Time Popular Products
      </motion.h3>

      {/* Desktop Arrows */}
      <div className="hidden sm:block">
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-2 rounded-full shadow hover:bg-black hover:text-white"
          disabled={currentIndex === 0}
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-black p-2 rounded-full shadow hover:bg-black hover:text-white"
          disabled={currentIndex + itemsPerPage >= products.length}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Product Slider with AnimatePresence */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="sync">
          {visibleItems.map((product, index) => (
            <motion.div
              key={product.id}
              className=" overflow-hidden shadow group relative transition"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {/* Product Image with Link */}
              <Link href={`https://ecobambo.com/products/${product.handle}`}>
                <div className="relative h-56 w-full overflow-hidden group cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.altText}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Mobile buttons on image */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 sm:hidden z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handlePrev();
                      }}
                      className="bg-white/70 text-black p-1 rounded-full shadow"
                      disabled={currentIndex === 0}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleNext();
                      }}
                      className="bg-white/70 text-black p-1 rounded-full shadow"
                      disabled={currentIndex + itemsPerPage >= products.length}
                    >
                      <FaChevronRight />
                    </button>
                  </div>

                  {/* Add to Cart button */}
                  {/* <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition duration-300">
                    <button 
                      className="bg-black text-white px-4 py-1 rounded-[20px] text-sm flex items-center gap-2 hover:bg-white hover:text-black border hover:border-black"
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to cart functionality can be implemented here
                      }}
                    >
                      <FiShoppingBag className="text-base" />
                      Add to Cart
                    </button>
                  </div> */}
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-3">
                <Link href={`/products/${product.handle}`}>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                </Link>
                {/* <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-sm font-bold text-green-600">
                  {product.currency} {product.price}
                </p> */}
                {/* {product.productType && (
                  <p className="text-xs text-gray-500 mt-1">
                    {product.productType}
                  </p>
                )} */}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show more products button */}
      {products.length > 0 && (
        <div className="text-center mt-8">
          <Link 
            href="https://ecobambo.com/collections"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All Products
          </Link>
        </div>
      )}
    </section>
  );
};

export default FSlider;
