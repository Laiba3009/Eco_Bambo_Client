import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { shopifyFetch } from "../lib/shopify";

const CategoryProducts = ({ category, title, limit = 8 }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products by category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        
        // Build query based on category type
        let query = "";
        if (category.type === "productType") {
          query = `product_type:'${category.value}'`;
        } else if (category.type === "tag") {
          query = `tag:'${category.value}'`;
        } else if (category.type === "collection") {
          query = `collection:'${category.value}'`;
        }

        const data = await shopifyFetch({
          query: `
            query GetCategoryProducts($first: Int!) {
              products(first: $first, query: "${query}", sortKey: BEST_SELLING) {
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
          variables: { first: limit },
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
        console.error('Error fetching category products:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (category) {
      fetchCategoryProducts();
    }
  }, [category, limit]);

  if (loading) {
    return (
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600">Discover our {category.value} collection</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/products/${product.handle}`}>
                <div className="relative h-48 overflow-hidden group cursor-pointer">
                  <img
                    src={product.image}
                    alt={product.altText}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  
                  {/* Quick view button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white text-black p-2 rounded-full shadow-md hover:bg-black hover:text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/products/${product.handle}`}>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
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
                <button className="w-full mt-3 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View more button */}
        <div className="text-center mt-8">
          <Link 
            href={`/category/${category.value.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            View All {category.value} Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryProducts; 