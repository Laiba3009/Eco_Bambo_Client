import React, { useState, useEffect } from "react";
import Link from "next/link";
import ImageSlider from "../components/ImageSlider";
import ProductDetail from "../components/ProductDetail";
import VideoPlayer from "../components/VideoPlayer";
import StepTutorial from "../components/StepTutorial";
import PromoBanner from "../components/PromoBanner";
import Reviews from "../components/Reviews";
import FAQSection from "../components/FAQ";
import FSlider from "../components/FSlider";
import FeatureHighlights from "../components/FeatureHighlights";
import CategoryProducts from "../components/CategoryProducts";
import { shopifyFetch } from "../lib/shopify";
import Head from 'next/head';

interface ProductImage {
  src: string;
  altText?: string;
}

interface ProductVariant {
  priceV2: {
    amount: string;
    currencyCode: string;
  };
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: ProductImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
}

const PRODUCTS_QUERY = `
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
        }
      }
    }
  }
`;

export default function Home() {
  const [currentImage, setCurrentImage] = useState("/images/big-red.png");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 Starting Shopify API call...');
    shopifyFetch({
      query: PRODUCTS_QUERY,
      variables: { first: 12 },
    })
      .then((data) => {
        console.log('✅ Shopify API response:', data);
        console.log('📦 Products data:', data.products);
        console.log('🔗 Products edges:', data.products.edges);
        setProducts(data.products.edges.map((edge: any) => edge.node));
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Shopify API error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading products...</div>;
  if (error) return <div className="p-10 text-center text-red-600">Error loading products: {error}</div>;

  console.log('🎯 Current state - Loading:', loading, 'Error:', error, 'Products count:', products.length);
  console.log('📋 Products array:', products);

  return (
    <>
      <Head>
        <title>Eco Bamboo - ECO BAMBOO</title>
      </Head>
      <div>
        {/* 🔹 Top Banner Slider */}
        <ImageSlider 
          images={[
            "/images/big-red.png",
            "/images/big-yellow.png",
            "/images/big-white.png"
          ]} 
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
        />

        {/* 🔹 Page Heading */}
        <h1 className="text-2xl font-bold text-center mt-6">
          Welcome to Our Product Collection
        </h1>

        {/* 🔹 Product Cards */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow transition flex flex-col">
              <Link href={`/products/${product.handle}`}>
                <img
                  src={product.images.edges[0]?.node.src || "/images/placeholder.jpg"}
                  alt={product.images.edges[0]?.node.altText || product.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-green-600 font-bold">
                  {product.variants.edges[0]?.node.priceV2.currencyCode} {product.variants.edges[0]?.node.priceV2.amount}
                </p>
              </Link>
            </div>
          ))}
        </div>

        {/* 🔹 Category-based Product Sections */}
        <CategoryProducts 
          category={{ type: "productType", value: "Plant Pot" }}
          title="Bamboo Plant Pots"
          limit={4}
        />
        
        <CategoryProducts 
          category={{ type: "productType", value: "Wall Art" }}
          title="Bamboo Wall Art"
          limit={4}
        />
        
        <CategoryProducts 
          category={{ type: "productType", value: "Furniture" }}
          title="Bamboo Furniture"
          limit={4}
        />

        {/* 🔹 Additional Components for Home Page */}
        <ProductDetail />
        <VideoPlayer />
        <StepTutorial />
        <PromoBanner />
        <Reviews />
        <FAQSection />
        <FSlider />
        <FeatureHighlights />
      </div>
    </>
  );
}
