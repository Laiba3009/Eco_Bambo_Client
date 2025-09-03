import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const products = [
  {
    id: 1,
    name: "Kingsley Chandler",
    image: "/images/image4.png",
    avatar: "/images/user4.png",
    text:
      "It's elegant, eco-friendly, and far better than any regular décor!!",
    rating: 5,
  },
  {
    id: 2,
    name: "Martha Lewis",
    image: "/images/image3.png",
    avatar: "/images/user3.png",
    text:
      "Absolutely love the craftsmanship! Delivery was on time and packaging was perfect.",
    rating: 4,
  },
  {
    id: 3,
    name: "Daniel Cooper",
    image: "/images/image2.png",
    avatar: "/images/user2.png",
    text:
      "Looks amazing on my wall, totally worth the price. Highly recommend!",
    rating: 5,
  },
  {
    id: 4,
    name: "Sophie Turner",
    image: "/images/image7.png",
    avatar: "/images/user1.png",
    text: "It's eco-friendly and looks premium. Happy with the purchase.",
    rating: 4,
  },
  {
    id: 5,
    name: "Michael Scott",
    image: "/images/image5.png",
    avatar: "/images/user5.png",
    text:
      "Very unique design. My friends keep asking where I bought it from!",
    rating: 5,
  },
  {
    id: 6,
    name: "Emma Watson",
    image: "/images/image6.png",
    avatar: "/images/user.png",
    text: "Great product and excellent customer service!",
    rating: 4,
  },
];

export const ProductsGlider = () => {
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [buttonLefts, setButtonLefts] = useState({ prev: 0, next: 0 });

  const getVisibleCount = (width: number) => {
    if (width < 768) {
      return 1;
    } else if (width < 1280) { // Adjusted for medium screens
      return 3;
    } else { // Large screens
      return 5;
    }
  };

  // Use a safe fallback width so first render is never 0px (e.g., SSR or before mount)
  const DEFAULT_WW = 375;
  const ww = windowWidth > 0 ? windowWidth : DEFAULT_WW;

  const visibleCount = getVisibleCount(ww);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const visibleProducts = Array.from({ length: visibleCount }, (_, i) => {
    return products[(startIndex + i) % products.length];
  });

  const getCardProps = (pos: number, cardW: number, gap: number) => {
    const totalWidth = cardW + gap;
    const centerIndex = Math.floor(visibleCount / 2);
    const offsetFromCenter = pos - centerIndex;

    const x = offsetFromCenter * totalWidth;
    const z = -Math.abs(offsetFromCenter) * 140 + (offsetFromCenter === 0 ? 120 : 0);
    const rotateY = offsetFromCenter * -20;
    const scale = offsetFromCenter === 0 ? 1.15 : 0.92;

    return { x, z, rotateY, scale };
  };

  const cardW = ww / (visibleCount === 1 ? 1.2 : visibleCount === 3 ? 3.5 : 6.5);
  const gap = cardW * 0.3;
  const buttonSpacing = 16;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setWindowWidth(window.innerWidth);
    // Seed initial width on mount so the first paint uses a real width
    setWindowWidth(window.innerWidth);
    setHasMounted(true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    if (!container || !prevBtn || !nextBtn) return;

    // Find the first and last visible cards
    const leftCard = (container as HTMLElement).querySelector('[data-pos="0"]') as HTMLElement | null;
    const rightCard = (container as HTMLElement).querySelector(`[data-pos="${visibleCount - 1}"]`) as HTMLElement | null;

    if (!leftCard || !rightCard) return;

    const cRect = (container as HTMLElement).getBoundingClientRect();
    const lRect = (leftCard as HTMLElement).getBoundingClientRect();
    const rRect = (rightCard as HTMLElement).getBoundingClientRect();

    const prevBtnWidth = (prevBtn as HTMLElement).offsetWidth;
    const nextBtnWidth = (nextBtn as HTMLElement).offsetWidth;

    const prevLeft = lRect.left - cRect.left - buttonSpacing - prevBtnWidth;
    const nextLeft = rRect.right - cRect.left + buttonSpacing;
    setButtonLefts({ prev: prevLeft, next: nextLeft });
  }, [windowWidth, visibleCount, startIndex, cardW]);

  const renderCardContent = (product: { id?: number; name: any; image: any; avatar: any; text: any; rating: any; }, cardW: number) => {
    const nameFontPx = Math.max(12, Math.min(19, Math.round(cardW * 0.068)));
    const ratingFontPx = Math.max(11, Math.min(17, Math.round(cardW * 0.058)));
    const textFontPx = Math.max(11, Math.min(17, Math.round(cardW * 0.056)));

    return (
      <div style={{ width: '100%', height: '100%', padding: '2px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <img src={product.image} alt={`${product.name} image`} style={{ width: '100%', height: '55%', display: 'block', objectFit: 'cover' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={product.avatar} alt={`${product.name} avatar`} width={32} height={32} style={{ borderRadius: '9999px' }} />
          <div style={{ fontWeight: 600, fontSize: `${nameFontPx}px` }}>{product.name}</div>
        </div>
        <div style={{ fontSize: `${ratingFontPx}px` }}>
          <span style={{ color: '#854d0e' }}>
            {`Rating: ${'★'.repeat(product.rating)}`}
          </span>
          {`${
            '☆'.repeat(Math.max(0, 5 - product.rating))
          }`}
        </div>
        <div style={{ fontSize: `${textFontPx}px`, lineHeight: 1.4 }}>
          {product.text}
        </div>
      </div>
    );
  }

  const renderMobileView = () => {
    // Static initial size before mount, responsive afterwards
    const mobileCardW = hasMounted ? ww * 0.8 : 320;
    const currentProduct = products[startIndex];

    return (
      <div className="w-full flex flex-col items-center justify-center space-y-4 ">
        <motion.div
          key={currentProduct.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden shadow-2xl bg-white text-gray-900 border border-gray-200"
          style={{ width: `${mobileCardW}px`, height: `${mobileCardW * 1.36}px` }}
        >
          {renderCardContent(currentProduct, mobileCardW)}
        </motion.div>
        <div className="flex space-x-4">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-gray-900/70 hover:bg-gray-900 text-white flex items-center justify-center shadow-xl backdrop-blur"
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-gray-900/70 hover:bg-gray-900 text-white flex items-center justify-center shadow-xl backdrop-blur"
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    );
  };

  const renderDesktopView = () => {
    return (
      <div ref={containerRef} className="relative w-full max-w-7xl mx-auto mr-52">
        <div className="relative mx-auto  w-full h-[320px] sm:h-[380px] md:h-[440px] lg:h-[520px] perspective-[1500px] overflow-visible grid place-items-center pointer-events-none">
          <AnimatePresence initial={false}>
            {visibleProducts.map((product, index) => {
              const { rotateY, scale, x, z } = getCardProps(index, cardW, gap);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { type: "spring", stiffness: 100, damping: 15 },
                  }}
                  exit={{ opacity: 0 }}
                  data-pos={index}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl flex items-center justify-center shadow-2xl bg-white text-gray-900 border border-gray-200 will-change-transform pointer-events-auto"
                  style={{
                    width: `${cardW}px`,
                    height: `${cardW * 1.36}px`,
                    transformStyle: "preserve-3d",
                    transform: `perspective(1500px) translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  }}
                >
                  {renderCardContent(product, cardW)}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <button
            onClick={handlePrev}
            ref={prevBtnRef}
            className="absolute top-[75%] md:translate-x-8  -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900/70 hover:bg-gray-900 text-white flex items-center justify-center shadow-xl ring-1 ring-white/20 hover:ring-white/40 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ left: `${buttonLefts.prev}px` }}
            aria-label="Previous"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-6 md:h-6"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <button
            onClick={handleNext}
            ref={nextBtnRef}
            className="absolute top-[75%] -translate-x-11 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900/70 hover:bg-gray-900 text-white flex items-center justify-center shadow-xl ring-1 ring-white/20 hover:ring-white/40 backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{ left: `${buttonLefts.next}px` }}
            aria-label="Next"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-6 md:h-6"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    );
  };

  return (
    <div className="w-full py-12 px-4 md:px-8 flex justify-center">
      {visibleCount === 1 ? renderMobileView() : renderDesktopView()}
    </div>
  );
};