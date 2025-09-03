import React from "react";
import PromoBanner1 from "@/components/PromoBanner1";
import PromoBanner2 from "@/components/PromoBanner2";
import dynamic from "next/dynamic";
import TrustooReviewSection from "@/components/TrustooReviewSection";

// Dynamically import components that have client-side dependencies
const DynamicProductsGlider = dynamic(() => import("@/components/ProductsGlider").then(mod => ({ default: mod.ProductsGlider })), {
  ssr: false,
  loading: () => <div className="w-full py-12 px-4 md:px-8 flex justify-center">Loading...</div>
});

const DynamicRelatedProducts2 = dynamic(() => import("@/components/RelatedProducts2"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 flex flex-col items-center justify-center p-4">Loading...</div>
});

const DynamicRelatedProducts3 = dynamic(() => import("@/components/RelatedProducts3"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-red-200 flex flex-col items-center justify-center p-4">Loading...</div>
});

const DynamicScrollReviews = dynamic(() => import("@/components/ScrollReviews"), {
  ssr: false,
  loading: () => <div className="w-full py-12 px-4 md:px-8 flex justify-center">Loading...</div>
});

export default function ProductCarousel() {
  return (
    <div className="mt-36">
      <DynamicProductsGlider />
      <div className="my-36">
        <DynamicRelatedProducts2 />
        <DynamicRelatedProducts3 />
        <PromoBanner1 />
        <PromoBanner2 />
        <DynamicScrollReviews />
        <TrustooReviewSection />
      </div>
    </div>
  );
}
