import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { shopifyFetch } from "../lib/shopify";
import Link from "next/link";

// Custom Typewriter component (reused for consistency)
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
  const [text, setText] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentString = strings[stringIndex];
    let timeout: NodeJS.Timeout;

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

// Product interface for Shopify data
interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        src: string;
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        priceV2: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  tags: string[];
  productType?: string;
}

// Transformed product interface for display
interface Product {
  id: string;
  name: string;
  handle: string;
  description: string;
  price: string;
  image: string;
  productType?: string;
}

// Animation Variants for initial product card entrance
const cardEntranceVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

const RelatedProducts3 = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [refReady, setRefReady] = useState(false);

  // Set client state after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if ref is ready after client mount
  useEffect(() => {
    if (isClient && scrollRef.current) {
      setRefReady(true);
    }
  }, [isClient]);

  // Only use useScroll when both client is mounted AND ref is ready
  const scrollData = useScroll({ 
    container: refReady ? scrollRef : undefined 
  });

  // Safely destructure scrollXProgress with fallback
  const scrollXProgress = scrollData?.scrollXProgress || { current: 0 };

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

        // Transform Shopify data to our Product interface
        const transformedProducts = data.products.edges
          .map((edge: { node: ShopifyProduct }) => {
            const node = edge.node;
            return {
              id: node.id,
              name: node.title,
              handle: node.handle,
              description: node.description,
              price: `${node.variants.edges[0]?.node.priceV2.currencyCode || ""} ${node.variants.edges[0]?.node.priceV2.amount || "N/A"}`,
              image: node.images.edges[0]?.node.src || "/images/placeholder.jpg",
              productType: node.productType
            };
          })
          .filter((product: { image: string; price: string | string[]; }) => {
            // Filter out products without images or prices
            if (!product.image || product.image === "/images/placeholder.jpg") return false;
            if (product.price.includes("N/A")) return false;
            return true;
          })
          .slice(0, 6); // Limit to 6 products for the slider

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Define the scale transform for the animated text div
  // It scales from 1 (full size) down to 0 (disappears)
  // as scrollXProgress goes from 0 to 0.2 (adjust this range for desired speed)
  const textScale = useTransform(
    scrollXProgress,
    [0, 0.2], // When scrollXProgress is 0, scale is 1. When it's 0.2, scale is 0.
    [1, 0]
  );

  // Define the opacity transform for the animated text div to fade out
  const textOpacity = useTransform(
    scrollXProgress,
    [0, 0.15], // Starts fading at 0, fully transparent at 0.15
    [1, 0]
  );

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !isClient || !refReady) return;

    const handleScroll = () => {
      const el = element as HTMLElement;
      const scrollLeft = el.scrollLeft;
      const scrollWidth = el.scrollWidth - el.clientWidth;

      if (scrollWidth > 0) {
        // Find the width of the first child (text div) safely
        const textDivWidth = (() => {
          const firstChild = (element as HTMLElement).children[0] as HTMLElement | undefined;
          return firstChild ? firstChild.offsetWidth : 0;
        })();

        // Calculate the scrollable width for products only
        const productsScrollableWidth = scrollWidth - textDivWidth;

        // Adjust scrollLeft to start counting from after the text div
        const adjustedScrollLeft = Math.max(0, scrollLeft - textDivWidth);

        // Calculate progress based on product scrolling only
        const progress = (adjustedScrollLeft / productsScrollableWidth) * 100;
        setScrollProgress(isNaN(progress) || !isFinite(progress) ? 0 : progress);
      } else {
        setScrollProgress(0);
      }
    };

    (element as HTMLElement).addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => {
      (element as HTMLElement).removeEventListener('scroll', handleScroll);
    };
  }, [products, isClient, refReady]); // Recalculate if products change, client state changes, or ref becomes ready

  // Show loading state during SSR or initial client render
  if (!isClient || loading) {
    return (
      <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 font-sans">
        <div className="max-w-6xl mx-auto w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading products from Shopify...</p>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 font-sans">
        <div className="max-w-6xl mx-auto w-full text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || "No products available"}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto w-full">
        {/* Product Slider Container - now includes the animated text */}
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll snap-x snap-mandatory pb-8 space-x-6 md:space-x-8 lg:space-x-10 px-4 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Static Title as the first item in the slider - always visible */}
          <div className="flex-none w-64 md:w-72 lg:w-80 bg-black text-white rounded-xl shadow-xl overflow-hidden snap-start flex items-center justify-center p-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight drop-shadow-sm">
              <CustomTypewriter
                strings={["Explore Our Latest Products!", "Handpicked for Your Home!", "Shop Unique Decor & Plants!"]}
                delay={80}
                loop={true}
              />
            </h2>
          </div>

          {/* Animated Title that scales and fades with scroll */}
          {/* <motion.div
            className="flex-none w-64 md:w-72 lg:w-[0px] bg-indigo-700 text-white rounded-xl shadow-xl overflow-hidden snap-start flex items-center justify-center p-6 text-center"
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ scale: textScale, opacity: textOpacity }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight drop-shadow-sm">
              <CustomTypewriter
                strings={["Explore Our Latest Products!", "Handpicked for Your Home!", "Shop Unique Decor & Plants!"]}
                delay={70}
                loop={true}
              />
            </h2>
          </motion.div> */}

          {/* Product Cards - NO X TRANSFORM FROM SCROLL */}
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex-none w-64 md:w-72 lg:w-80 bg-white rounded-xl shadow-xl overflow-hidden snap-center cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
            >
              <Link href={`/products/${product.handle}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-t-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://placehold.co/300x400/CCCCCC/000000?text=Image+Error`;
                  }}
                />
              </Link>
              <div className="p-5">
                <Link href={`/products/${product.handle}`}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-yellow-500">{product.price}</span>
                  <Link href={`/products/${product.handle}`}>
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200 shadow-md">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-2.5 mt-8 overflow-hidden">
          <motion.div
            className="bg-yellow-500 h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${scrollProgress}%` }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts3;
