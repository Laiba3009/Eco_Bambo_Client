import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { shopifyFetch } from "../lib/shopify";

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch related products
  useEffect(() => {
    if (!currentProduct) return;

    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query based on available product data
        let query = "";
        
        if (currentProduct.productType) {
          query = `product_type:'${currentProduct.productType}'`;
        } else if (currentProduct.tags && currentProduct.tags.length > 0) {
          query = `tag:'${currentProduct.tags[0]}'`;
        } else {
          // Fallback: get all products and filter by similarity
          query = "";
        }

        const data = await shopifyFetch({
          query: `
            query GetRelatedProducts($first: Int!, $query: String) {
              products(first: $first, query: $query) {
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
          variables: { 
            first: 12, // Get more products to filter from
            query: query || null
          },
        });

        if (!data.products || !data.products.edges) {
          throw new Error("No products data received");
        }

        // Transform and filter products
        const fetchedProducts = data.products.edges
          .map(edge => {
            const node = edge.node;
            return {
              id: node.id,
              title: node.title,
              handle: node.handle,
              description: node.description,
              image: node.images.edges[0]?.node.src || "/images/placeholder.jpg",
              altText: node.images.edges[0]?.node.altText || node.title,
              price: node.variants.edges[0]?.node.priceV2.amount || "N/A",
              currency: node.variants.edges[0]?.node.priceV2.currencyCode || "",
              tags: node.tags || [],
              productType: node.productType
            };
          })
          .filter(product => {
            // Filter out the current product
            if (product.id === currentProduct.id) return false;
            
            // Filter out products without images
            if (!product.image || product.image === "/images/placeholder.jpg") return false;
            
            // Filter out products without prices
            if (product.price === "N/A") return false;
            
            return true;
          })
          .slice(0, 4); // Limit to 4 related products

        setRelatedProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProduct]);

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Related Products</h2>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading related products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || relatedProducts.length === 0) {
    return null; // Don't show section if no related products
  }

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Related Products
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href={`/products/${product.handle}`} passHref>
                <div className="relative h-48 overflow-hidden group cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.altText}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  
                  {/* Quick view indicator */}
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/products/${product.handle}`} passHref>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                    {product.title}
                  </h3>
                </Link>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-green-600">
                    {product.currency} {product.price}
                  </p>
                  
                  {product.productType && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.productType}
                    </span>
                  )}
                </div>
                
                {/* Add to cart button */}
                <button className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                  View Product
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View all products link */}
        <div className="text-center mt-8">
          <Link href="/products" passHref>
            <button className="bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors duration-200 font-medium">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts; 