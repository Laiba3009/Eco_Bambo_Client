import React, { useRef, useState, useEffect } from 'react';

export default function App() {
  // useRef hook to create a reference to the main animation container DOM element.
  // This allows us to measure its position and height to calculate scroll progress.
  const animationContainerRef = useRef(null);
  
  // useState hook to store the current scroll progress, from 0 (start) to 1 (end).
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // New state to manage the active slide for the carousel functionality.
  const [currentSlide, setCurrentSlide] = useState(0);

  // The array of review objects. This is the data that will be rendered in the cards.
  const reviews = [
    {
      id: 1,
      name: "Kingsley Chandler",
      image: "/images/image4.png",
      avatar: "/images/user4.png",
      text: "I bought a bamboo hanging wall décor (big size) from EcoBambo, and it's stunning! It blends beautifully with my lounge wall art and home wall art décor. The quality is far better than Wayfair and Amazon wall décor—natural, stylish, and eco-friendly! It's elegant, eco-friendly, and far better than any regular décor!!",
      rating: 5,
    },
    {
      id: 2,
      name: "Martha Lewis",
      image: "/images/image3.png",
      avatar: "/images/user3.png",
      text: "Absolutely love the craftsmanship! Delivery was on time and packaging was perfect.",
      rating: 4,
    },
    {
      id: 3,
      name: "Daniel Cooper",
      image: "/images/image2.png",
      avatar: "/images/user2.png",
      text: "Looks amazing on my wall, totally worth the price. Highly recommend!",
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
      text: "Very unique design. My friends keep asking where I bought it from!",
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

  // Helper function to dynamically adjust font size based on text length.
  // This helps ensure the text fits within the card's designated space.
  const getFontSizeClass = (text: string) => {
    if (text.length > 200) {
      return 'text-xs';
    } else if (text.length > 100) {
      return 'text-sm';
    }
    return 'text-base';
  };

  // The useEffect hook is used to add and remove the scroll event listener.
  // This ensures the logic runs only when the component is mounted.
  useEffect(() => {
    // The core function that calculates the scroll progress.
    const handleScroll = () => {
      if (!animationContainerRef.current) return;
      
      const element = animationContainerRef.current as HTMLElement;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 'elementTop' is the distance of the top of the container from the viewport top.
      const elementTop = rect.top;
      // 'elementHeight' is the total height of the animation container.
      const elementHeight = rect.height;
      
      // 'totalScrollDistance' is the total scrollable height over which the animation takes place.
      // This is the key value to control the animation duration. Increase it to make the animation longer.
      const totalScrollDistance = elementHeight - windowHeight;
      const currentScroll = Math.max(0, -elementTop);
      
      let progress = 0;
      if (totalScrollDistance > 0) {
        // 'progress' maps the scroll position to a value between 0 and 1.
        progress = currentScroll / totalScrollDistance;
      }
      
      // 'clampedProgress' ensures the value stays within the 0-1 range.
      const clampedProgress = Math.max(0, Math.min(1, progress));
      setScrollProgress(clampedProgress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variables, derived from the scroll progress.
  // These control the state of the animation elements.
  const finalProgress = Math.min(2, scrollProgress);
  const reviewsTransform = `translateX(-${finalProgress * 596}rem)`; // Controls text separation
  const sectionTransform = `translateX(${finalProgress * 596}rem)`;
  const textOpacity = Math.max(0, 1 - (finalProgress * 1)); // Controls text fade-out
  
  const reviewsScale = `scale(${Math.min(1, Math.max(0.1, finalProgress * 10.5))})`; // Controls card scaling
  const reviewsOpacity = Math.min(1, finalProgress * 4); // Controls card fade-in

  // Functions for carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + reviews.length) % reviews.length);
  };
  
  return (
    <div className="bg-white text-gray-100 font-sans">
      
      {/* The main animation container. Its height (h-[200vh]) and top margin (mt-[50vh])
          determine the scrollable area for the pinning and animation effect.
          - 'h-[200vh]' provides 2 full viewport heights of scrollable space.
          - 'mt-[50vh]' adds initial spacing from the top of the page.
      */}
      <div 
        ref={animationContainerRef} 
        className="relative w-full h-[150vh] "
      >
        {/* This is the sticky container that "pins" the content to the top of the viewport.
            - 'sticky top-1' pins it just below the very top.
            - 'min-h-[150vh]' ensures it fills the entire viewport height.
            - 'overflow-hidden' prevents children from extending outside this container.
        */}
        <div className="sticky top-1 w-full min-h-[150vh] flex items-center justify-center overflow-hidden">
          
          {/* This div contains the review cards and is animated by scroll. */}
          <div
            className="absolute inset-0  pt-36 flex items-center justify-center px-8"
            style={{ 
              transform: reviewsScale, // Applies the scaling animation
              opacity: reviewsOpacity, // Applies the fade-in animation
              transformOrigin: 'center center',
              zIndex: 1,
              transition: 'none' // Disables default CSS transitions to avoid conflicts with scroll-based animation
            }}
          >
            {/* Wrapper for the swipeable/scrollable card container. */}
            <div className={`w-full overflow-x-auto scroll-smooth snap-x snap-mandatory  ${reviewsOpacity > 0.9 ? 'block' : 'hidden'}`}>
                {/* The card container itself. 'gap-8' for spacing.
                    The 'transform' property is now controlled by the `currentSlide` state. */}
                <div className="flex gap-8 px-4 py-8  " style={{ transform: `translateX(-${currentSlide * 22}rem)` }}>
                    {reviews.map((review, index) => (
                      <div
                        key={review.id}
                        className="flex-shrink-0 snap-center  bg-white rounded-lg shadow-xl border border-gray-600 w-[20rem] md:w-80 h-[350px] flex flex-col"
                        style={{
                          transitionDelay: `${index * 100}ms`
                        }}
                      >
                        <img src={review.image} alt="Product" className="w-full h-40 object-cover rounded-t-lg" />
                        <div className="p-4 flex flex-col h-full">
                          <div>
                            <div className="flex items-center mb-2">
                              <div className="flex text-yellow-400">
                                {Array.from({ length: review.rating }, (_, i) => (
                                  <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.376 2.454a1 1 0 00-.364 1.118l1.287 3.961c.3.921-.755 1.688-1.538 1.118l-3.376-2.454a1 1 0 00-1.176 0l-3.376 2.454c-.783.57-1.838-.197-1.538-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.525 9.387c-.783-.57-.381-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.96z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <div className="h-24 overflow-y-auto ">
                              <p className={`text-black italic leading-tight ${getFontSizeClass(review.text)}`}>{review.text}</p>
                            </div>
                          </div>
                          <div className="flex items-center ">
                            <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full mr-3" />
                            <p className="text-sm font-semibold text-black">{review.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
            </div>
          </div>
          
          {/* Navigation Buttons for the carousel. They appear once the scroll animation is complete. */}
          {reviewsOpacity > 0.9 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none z-20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none z-20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </>
          )}

          {/* Text that separates. This div is animated to fade and move out of the way. */}
          <div 
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ opacity: textOpacity }}
          >
            <div className="flex items-center">
              <span
                className="text-6xl md:text-8xl font-extrabold text-black"
                style={{ 
                  transform: reviewsTransform,
                  whiteSpace: 'nowrap'
                }}
              >
                Reviews
              </span>
              <span
                className="text-6xl md:text-8xl font-extrabold text-black ml-8"
                style={{ 
                  transform: sectionTransform,
                  whiteSpace: 'nowrap'
                }}
              >
                Section
              </span>
            </div>
          </div>
        </div>
      </div>
      
      
      {/* Debug indicator to help visualize scroll progress and animation values. */}
      {/* <div className="fixed top-4 right-4 bg-black bg-opacity-70 p-3 rounded text-sm text-white">
        <div>Scroll Progress: {Math.round(scrollProgress * 150)}%</div>
        <div>Text Opacity: {textOpacity.toFixed(2)}</div>
        <div>Cards Opacity: {reviewsOpacity.toFixed(2)}</div>
        <div>Scale: {(0.1 + (finalProgress * 1.5)).toFixed(2)}</div>
      </div> */}
    </div>
  );
}