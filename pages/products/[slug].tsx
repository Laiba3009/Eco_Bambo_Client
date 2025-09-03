import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { shopifyFetch } from "../../lib/shopify";
import ImageSlider from "../../components/ImageSlider";
import AddToCart from "../../components/AddToCart";
import TextSlider from "../../components/TextSlider";
import Accordion from "../../components/Accordion";
import DynamicTutorialSection from "../../components/DynamicTutorialSection";
import PromoBanner from "../../components/PromoBanner";
import Reviews from "../../components/Reviews";
import FAQSection from "../../components/FAQ";
import FSlider from "../../components/FSlider";
import FeatureHighlights from "../../components/FeatureHighlights";
import RelatedProducts from "../../components/RelatedProducts";
import { FaShippingFast } from "react-icons/fa";
import Head from "next/head";
import ScrollReviews from "../../components/ScrollReviews";
import ReviewCheck from "@/components/ReviewCheck";

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

interface ProductImage {
  src: string;
  altText?: string;
}

interface ProductVariant {
  id: string;
  title: string;
  image?: {
    src: string;
    altText?: string;
  };
  selectedOptions?: Array<{
    name: string;
    value: string;
  }>;
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
  productType?: string;
  tags?: string[];
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

const PRODUCT_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      productType
      tags
      images(first: 10) {
        edges {
          node {
            src
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            image {
              src
              altText
            }
            selectedOptions {
              name
              value
            }
            priceV2 {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

// List of product handles that have static pages
const STATIC_PRODUCT_HANDLES = [
  "large-bamboo-standing-plant-pot-unique-affordable",
  "1-unique-bamboo-wall-hanging-affordable-home-wall-art-decor-in-small-sizes-for-living-areas",
  "small-bamboo-flower-pot-with-stand-stylish-indoor-artificial-pot"
];

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    
    const productHandle = typeof slug === "string" ? slug : "";
    
    // Check if this is a static product that should redirect to its dedicated page
    if (STATIC_PRODUCT_HANDLES.includes(productHandle)) {
      router.replace(`/products/${productHandle}`);
      return;
    }
    
    setLoading(true);
    shopifyFetch({
      query: PRODUCT_QUERY,
      variables: { handle: productHandle },
    })
      .then((data) => {
        if (data.productByHandle) {
          setProduct(data.productByHandle);
          if (data.productByHandle.images.edges.length > 0) {
            setCurrentImage(data.productByHandle.images.edges[0].node.src);
          }
          if (data.productByHandle.variants.edges.length > 0) {
            setSelectedVariant({
              id: data.productByHandle.variants.edges[0].node.id,
              color: data.productByHandle.variants.edges[0].node.title,
              image: data.productByHandle.images.edges[0].node.src
            });
          }
        } else {
          setError("Product not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug, router]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error || !product) return <div className="p-10 text-center text-red-600">Error: {error || "Product not found"}</div>;

  // Transform Shopify data to match original structure
  const images = product.images.edges.map(edge => edge.node.src);
  const price = product.variants.edges[0]?.node.priceV2.amount || "N/A";
  const currency = product.variants.edges[0]?.node.priceV2.currencyCode || "";
  
  // Mock data to match original structure
  const productData = {
    title: product.title,
    ratings: "66+ (ratings)",
    note: "Selling fast! 10 people have this in their carts.",
    price: `${currency} ${price}`,
    originalPrice: `${currency} ${(parseFloat(price) * 1.17).toFixed(2)}`,
    discount: "15% OFF",
    deliveryEstimate: "Order in the next 23 hour(s) 54 minute(s) to get it between [26_March] and [29_March]",
    images: images,
    variants: product.variants.edges.map((edge) => {
      const colorOption = edge.node.selectedOptions?.find((opt: any) => opt.name.toLowerCase() === 'color');
      return {
        id: edge.node.id,
        color: colorOption ? colorOption.value : edge.node.title,
        image: edge.node.image?.src || '', // Only use the variant's own image
      };
    }),
    description: product.description
  };

  const handleColorClick = (variant: any) => {
    setSelectedVariant(variant);
    setCurrentImage(variant.image);
  };

  return (
    <>
      <Head>
        <title>{toTitleCase(product.title)} - EcoBamboo</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description.substring(0, 160)} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={images[0]} />
        <link rel="canonical" href={`https://ecobambo.com/products/${product.handle}`} />
      </Head>
      <div className="w-full max-w-[100vw] overflow-x-hidden p-3 mt-12">
      {/* Main Product Detail Section */}
      <div className="w-full max-w-7xl mx-auto py-6 grid grid-cols-1 md:grid-cols-2 sm:gap-8 px-0">
       
        {/* Left - ImageSlider */}
        <ImageSlider
          images={productData.images}
          currentImage={currentImage}
          setCurrentImage={setCurrentImage}
        />

        {/* Right - Product Info */}
        <div className="flex flex-col space-y-4 w-[100%]">
          {/* Title */}
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#000000] font-albert leading-tight mt-5">
            {productData.title}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-2">
            <div className="flex text-[#000000] text-base sm:text-lg">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <span key={i}>★</span>
                ))}
            </div>
            <p className="text-sm sm:text-base text-black">{productData.ratings}</p>
          </div>

          {/* Note */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-red-500 text-lg">⚡</span>
            <p className="text-lg sm:text-[24px] text-[#000000] font-jost">{productData.note}</p>
          </div>

          {/* Price Block */}
          <div className="flex flex-wrap items-center gap-4 text-lg sm:text-xl font-bold text-[#000000] font-albert">
            <span>{productData.price}</span>
            <span className="line-through text-gray-400">{productData.originalPrice}</span>
            <span className="bg-[#0167FF] text-white text-xs px-2 py-1 rounded-lg">
              {productData.discount}
            </span>
          </div>

          {/* Delivery Info */}
          <p className="text-sm sm:text-md text-gray-600 flex items-center gap-2">
            <FaShippingFast className="text-black" />
            {productData.deliveryEstimate}
          </p>

          {/* Color Selector */}
          <div>
            <h2 className="font-albert mb-2 text-sm text-black sm:text-base font-semibold">Color</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {productData.variants.map((variant: any, index: number) => (
                variant.image && (
                  <img
                    key={index}
                    src={variant.image}
                    alt={variant.color}
                    title={variant.color}
                    onClick={() => handleColorClick(variant)}
                    className={`w-10 h-10 object-cover rounded-full border-2 cursor-pointer ${
                      variant.color === selectedVariant?.color
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  />
                )
              ))}
            </div>
            <p className="text-sm text-gray-700">{selectedVariant?.color}</p>

            {/* Add to Cart Component */}
            {/* <AddToCart product={productData} selectedVariant={selectedVariant} /> */}
          </div>
          
        </div>
      </div>
      
      Accordion Section
      {/* <Accordion /> */}
      
      {/* Text Slider */}
      {/* <TextSlider /> */}
      
      {/* Related Products Section */}
      {/* <RelatedProducts currentProduct={product} /> */}

      {/* Additional Sections */}
      {/* <PromoBanner />
      <ReviewCheck />
      <ScrollReviews />
      <FAQSection />
      <FSlider />
      <FeatureHighlights /> */}
    </div>
    </>
  );
} 