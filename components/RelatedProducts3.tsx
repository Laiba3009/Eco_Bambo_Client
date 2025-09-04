import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { shopifyFetch } from "../lib/shopify";
import Link from "next/link";

// ✅ Custom Typewriter component
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

// ✅ Product interfaces
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

interface Product {
  id: string;
  name: string;
  handle: string;
  description: string;
  price: string;
  image: string;
  productType?: string;
}

// ✅ Main Component
const RelatedProducts3 = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [refReady, setRefReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && scrollRef.current) {
      setRefReady(true);
    }
  }, [isClient]);

  const scrollData = useScroll({
    container: refReady ? scrollRef : undefined,
  });

  const scrollXProgress = scrollData?.scrollXProgress || { current: 0 };

  // ✅ Fetch products
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
          .map((edge: { node: ShopifyProduct }) => {
            const node = edge.node;
            return {
              id: node.id,
              name: node.title,
              handle: node.handle,
              description: node.description,
              price: `${node.variants.edges[0]?.node.priceV2.currencyCode || ""} ${
                node.variants.edges[0]?.node.priceV2.amount || "N/A"
              }`,
              image:
                node.images.edges[0]?.node.src || "/images/placeholder.jpg",
              productType: node.productType,
            };
          })
          .filter((product: Product) => {
            if (!product.image || product.image === "/images/placeholder.jpg")
              return false;
            if (product.price.includes("N/A")) return false;
            return true;
          })
          .slice(0, 6);

        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Scroll Progress
  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !isClient || !refReady) return;

    const handleScroll = () => {
      const el = element as HTMLElement;
      const scrollLeft = el.scrollLeft;
      const scrollWidth = el.scrollWidth - el.clientWidth;

      if (scrollWidth > 0) {
        const textDivWidth = (() => {
          const firstChild = (element as HTMLElement).children[0] as
            | HTMLElement
            | undefined;
          return firstChild ? firstChild.offsetWidth : 0;
        })();

        const productsScrollableWidth = scrollWidth - textDivWidth;
        const adjustedScrollLeft = Math.max(0, scrollLeft - textDivWidth);

        const progress = (adjustedScrollLeft / productsScrollableWidth) * 100;
        setScrollProgress(
          isNaN(progress) || !isFinite(progress) ? 0 : progress
        );
      } else {
        setScrollProgress(0);
      }
    };

    element.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [products, isClient, refReady]);

  // ✅ Loading State
  if (!isClient || loading) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center py-12 px-4 font-sans">
        <div className="max-w-full mx-auto w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            Loading products from Shopify...
          </p>
        </div>
      </section>
    );
  }

  // ✅ Error State
  if (error || products.length === 0) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center py-12 px-4 font-sans">
        <div className="max-w-full mx-auto w-full text-center">
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

  // ✅ Render
  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-12 px-4 font-sans">
      <div className="max-w-full mx-auto w-full">
        <div
          ref={scrollRef}
          className="flex overflow-x-scroll snap-x snap-mandatory pb-8 space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 px-2 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* ✅ Text Animation Card with Image */}
          <div
            className="flex-none w-56 sm:w-64 md:w-72 lg:w-80 xl:w-96 rounded-xl shadow-xl overflow-hidden snap-start flex items-center justify-center p-6 text-center relative"
            style={{
              backgroundImage: "url('/images/large-f.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
            <h2 className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white drop-shadow-md">
              <CustomTypewriter
                strings={[
                  "Explore Our Latest Products!",
                  "Handpicked for Your Home!",
                  "Shop Unique Decor & Plants!",
                ]}
                delay={80}
                loop={true}
              />
            </h2>
          </div>

          {/* ✅ Product Cards */}
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="flex-none w-56 sm:w-64 md:w-72 lg:w-80 xl:w-96 bg-white rounded-xl shadow-xl overflow-hidden snap-center cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.42, 0, 0.58, 1],
              }}
            >
              <Link href={`/products/${product.handle}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 sm:h-64 object-cover rounded-t-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `/images/placeholder.jpg`;
                  }}
                />
              </Link>
              <div className="p-4 sm:p-5">
                <Link href={`/products/${product.handle}`}>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-yellow-500">
                    {product.price}
                  </span>
                  <Link href={`/products/${product.handle}`}>
                    <button className="bg-black text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors duration-200 shadow-md">
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ✅ Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-8 overflow-hidden">
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
