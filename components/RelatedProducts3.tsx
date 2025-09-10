import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { shopifyFetch } from "../lib/shopify";
import Link from "next/link";

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

// ✅ Shopify Storefront domain
const SHOPIFY_DOMAIN = "https://ecobambo.com"; // <-- apna Shopify domain yahan dalen

const RelatedProducts3: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Auto slider effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const el = scrollRef.current;
        const isAtEnd =
          el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

        if (isAtEnd) {
          el.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
        }
      }
    }, 4000); // har 4 second me slide

    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch products from Shopify
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

        const transformed = data.products.edges.map(
          (edge: { node: ShopifyProduct }) => {
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
          }
        );

        setProducts(
          transformed
            .filter((p: Product) => p.image && !p.price.includes("N/A"))
            .slice(0, 10)
        );

        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Loading State
  if (loading) {
    return (
      <section className="min-h-[50vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading products...</p>
        </div>
      </section>
    );
  }

  // ✅ Error State
  if (error || products.length === 0) {
    return (
      <section className="min-h-[50vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
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

  // ✅ Render UI
  return (
    <section className="w-full py-12 px-4">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black my-10"
      >
        Related Products
      </motion.h2>

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll space-x-6 pb-6 scrollbar-hide snap-x snap-mandatory"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="flex-none w-64 bg-white rounded-xl shadow-md overflow-hidden snap-center cursor-pointer transform transition-transform duration-300 hover:scale-105"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <a
              href={`${SHOPIFY_DOMAIN}/products/${product.handle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </a>
            <div className="p-4">
              <a
                href={`${SHOPIFY_DOMAIN}/products/${product.handle}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
              </a>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-yellow-500">
                  {product.price}
                </span>
                <a
                  href={`${SHOPIFY_DOMAIN}/products/${product.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    View
                  </button>
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts3;
