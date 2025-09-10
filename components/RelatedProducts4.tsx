import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { shopifyFetch } from "../lib/shopify";
import { motion } from 'framer-motion';


// Product interface
interface Product {
  id: string;
  name: string;
  handle: string;
  price: string;
  image: string;
  productType?: string;
}

// Product Card (clean style)
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const shopifyDomain = "https://ecobambo.com"; // apna Shopify domain
  const productUrl = `${shopifyDomain}/products/${product.handle}`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden text-center
                    w-[240px] h-[360px] flex flex-col justify-between
                    hover:shadow-lg transition-shadow shrink-0 mx-3">
      {/* Image */}
      <a href={productUrl} target="_blank" rel="noopener noreferrer">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover cursor-pointer"
        />
      </a>

      <div className="p-3 flex-1 flex flex-col">
        {/* Title */}
        <a href={productUrl} target="_blank" rel="noopener noreferrer">
          <h3 className="text-base font-semibold mb-2 text-gray-800 hover:text--[#b8860b] line-clamp-2">
            {product.name}
          </h3>
        </a>

        {/* Price */}
        <p className="text-lg font-bold text-green-600 mb-2">{product.price}</p>

        {/* Product type */}
        {product.productType && (
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full mb-2">
            {product.productType}
          </span>
        )}

        {/* Button */}
        <a href={productUrl} target="_blank" rel="noopener noreferrer" className="mt-auto">
          <button className="w-full bg-[#b8860b] text-white py-2 rounded-md hover:bg-black transition-colors text-sm">
            View Product
          </button>
        </a>
      </div>
    </div>
  );
};

// Main Slider
const RelatedProducts4 = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true, // ✅ swipe by hand
  });
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await shopifyFetch({
          query: `
            query GetProducts($first: Int!) {
              products(first: $first) {
                edges {
                  node {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges { node { src } }
                    }
                    variants(first: 1) {
                      edges { node { priceV2 { amount currencyCode } } }
                    }
                    productType
                  }
                }
              }
            }
          `,
          variables: { first: 12 },
        });

        const transformed = data.products.edges.map((edge: { node: any }) => {
          const node = edge.node;
          return {
            id: node.id,
            name: node.title,
            handle: node.handle,
            price: `${node.variants.edges[0]?.node.priceV2.currencyCode || ""} ${
              node.variants.edges[0]?.node.priceV2.amount || "N/A"
            }`,
            image: node.images.edges[0]?.node.src || "/images/placeholder.jpg",
            productType: node.productType,
          };
        });

        setProducts(transformed);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching products");
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
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (loading) return <div className="text-center py-20">Loading products...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-6 relative">
      {/* ✅ Only heading */}
           <motion.h2
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-black my-10"
            >
              Related Products
            </motion.h2>

      {/* Slider */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex -mx-3">
          {products.map((product) => (
            <div key={product.id} className="embla__slide">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <button
        className="absolute top-1/2 -left-8 -translate-y-1/2 bg-[#b8860b] text-white p-3 rounded-full shadow hover:bg-gray-800"
        onClick={scrollPrev}
      >
        ‹
      </button>
      <button
        className="absolute top-1/2 -right-8 -translate-y-1/2 bg-[#b8860b] text-white p-3 rounded-full shadow hover:bg-gray-800"
        onClick={scrollNext}
      >
        ›
      </button>

      {/* Dots */}
      <div className="flex justify-center mt-6">
        {products.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 mx-1 rounded-full ${
              idx === currentSlideIndex ? "bg-black" : "bg-gray-400"
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts4;
