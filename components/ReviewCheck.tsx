"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";

interface Review {
  id: number;
  name: string;
  images: string[];
  avatar: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Ali Raza",
    images: ["/images/Sf1.jpg", "/images/Sf2.JPG", "/images/Sf3.JPG"],
    avatar: "/images/user1.png",
    text: "Maine EcoBamboo ka Small Flower Pot liya aur mujhe bohot pasand aya. Yeh simple aur elegant hai, ghar ko natural aur stylish touch deta hai. Quality waqai zabardast hai!",
    rating: 5,
  },
  {
    id: 2,
    name: "Ahmed",
    images: ["/images/Hw1.png", "/images/Hw3.jpg", "/images/Hw9.JPG"],
    avatar: "/images/user2.png",
    text: "Maine Bamboo Hanging Wall lagwaya aur woh bohot hi khubsurat lagta hai. EcoBamboo ka design aur eco-friendly kaam waqai lajawab hai. Ghar ka mahol fresh aur stylish hogaya!",
    rating: 4,
  },
  {
    id: 3,
    name: "Michael Scott",
    images: ["/images/Shw4.png", "/images/Shw7.jpg", "/images/Shw2.png"],
    avatar: "/images/user3.png",
    text: "I recently added a Small Hanging Wall from EcoBamboo, and it has completely brightened up my space. The craftsmanship and eco-friendly quality are excellent.",
    rating: 5,
  },
  {
    id: 4,
    name: "Emma Watson",
    images: ["/images/Sf6.png", "/images/Sf3.JPG"],
    avatar: "/images/user4.png",
    text: "The Small Flower Pot from EcoBamboo is such a charming addition to my home. Simple, elegant, and eco-friendly. Highly recommended!",
    rating: 4,
  },
  {
    id: 5,
    name: "Sophia Khan",
    images: ["/images/Hw5.JPG", "/images/Hw6.jpg"],
    avatar: "/images/user5.png",
    text: "EcoBamboo ka Hanging Wall decor bohot hi classy hai. Mere drawing room ki look bilkul badal gayi. Highly recommended!",
    rating: 5,
  },
  {
    id: 6,
    name: "David Miller",
    images: ["/images/Sf4.JPG", "/images/Sf5.Jpg"],
    avatar: "/images/user.png",
    text: "The Flower Pot from EcoBamboo is simple yet very stylish. It adds a modern and eco-friendly touch to my space.",
    rating: 4,
  },
];

function Reviews(): JSX.Element {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<Record<number, number>>({});
  const [fullscreen, setFullscreen] = useState<{
    reviewId: number | null;
    imageIndex: number;
  }>({ reviewId: null, imageIndex: 0 });
  const [cardsToShow, setCardsToShow] = useState<number>(3);

  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    updateCardsToShow();
    window.addEventListener("resize", updateCardsToShow);
    return () => window.removeEventListener("resize", updateCardsToShow);
  }, []);

  const maxIndex = reviews.length - cardsToShow;

  const nextSlide = (): void => {
    if (startIndex < maxIndex) setStartIndex(startIndex + 1);
  };

  const prevSlide = (): void => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const visibleReviews = reviews.slice(startIndex, startIndex + cardsToShow);

  // Fullscreen navigation
  const nextImage = () => {
    if (fullscreen.reviewId === null) return;
    const review = reviews.find((r) => r.id === fullscreen.reviewId);
    if (!review) return;
    setFullscreen((prev) => ({
      reviewId: prev.reviewId,
      imageIndex: (prev.imageIndex + 1) % review.images.length,
    }));
  };

  const prevImage = () => {
    if (fullscreen.reviewId === null) return;
    const review = reviews.find((r) => r.id === fullscreen.reviewId);
    if (!review) return;
    setFullscreen((prev) => ({
      reviewId: prev.reviewId,
      imageIndex:
        (prev.imageIndex - 1 + review.images.length) % review.images.length,
    }));
  };

  const fullscreenHandlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <section className="py-12 mb-20 mt-20 bg-white relative">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
        className="text-xl sm:text-2xl md:text-4xl font-semibold text-center mb-8 text-black"
      >
        Customer Reviews
      </motion.h2>

      <div {...handlers} className="flex items-center justify-center gap-4 w-full px-0">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          disabled={startIndex === 0}
          className="hidden sm:flex flex-shrink-0 p-3 bg-white shadow-md rounded-full hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous reviews"
        >
          <FaChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Reviews */}
        <div className="flex-1 overflow-hidden">
          <div
            className={`grid gap-6 ${
              cardsToShow === 1
                ? "grid-cols-1"
                : cardsToShow === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {visibleReviews.map((review) => {
              const selectedIndex = selectedImages[review.id] || 0;
              const mainImage = review.images[selectedIndex];

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Main Image */}
                  <div
                    className="mb-2 flex-shrink-0 cursor-pointer"
                    onClick={() =>
                      setFullscreen({ reviewId: review.id, imageIndex: selectedIndex })
                    }
                  >
                    <Image
                      src={mainImage}
                      alt={`Product from ${review.name}'s review`}
                      width={400}
                      height={300}
                      className="w-full h-60 object-cover rounded-md"
                    />
                  </div>

                  {/* Thumbnails */}
                  {review.images.length > 1 && (
                    <div className="flex gap-2 justify-center mt-2 mb-4">
                      {review.images.slice(0, 4).map((img, index) => (
                        <div
                          key={index}
                          className={`w-12 h-12 relative cursor-pointer border rounded-md overflow-hidden ${
                            selectedIndex === index
                              ? "border-[#b8860b]"
                              : "border-gray-200"
                          }`}
                          onClick={() => {
                            setSelectedImages((prev) => ({
                              ...prev,
                              [review.id]: index,
                            }));
                            setFullscreen({ reviewId: review.id, imageIndex: index });
                          }}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex justify-center mb-3">
                    <div className="flex text-yellow-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="flex-1 mb-4">
                    <p className="text-gray-600 text-sm leading-relaxed italic">
                      "{review.text}"
                    </p>
                  </div>

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <Image
                      src={review.avatar}
                      alt={`Avatar of ${review.name}`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {review.name}
                      </p>
                      <p className="text-xs text-gray-500">Verified Customer</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          disabled={startIndex >= maxIndex}
          className="hidden sm:flex flex-shrink-0 p-3 bg-white shadow-md rounded-full hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next reviews"
        >
          <FaChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: maxIndex + 1 }, (_, i) => (
          <button
            key={i}
            onClick={() => setStartIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              i === startIndex ? "bg-[#b8860b] w-6" : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Fullscreen Image Viewer */}
      {fullscreen.reviewId !== null && (
        <div
          {...fullscreenHandlers}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setFullscreen({ reviewId: null, imageIndex: 0 })}
            aria-label="Close image viewer"
          >
            <IoClose />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white text-3xl p-2 bg-black/50 rounded-full"
          >
            <FaChevronLeft />
          </button>

          <div className="relative w-[90%] h-[90%]">
            {reviews.find((r) => r.id === fullscreen.reviewId) && (
              <Image
                src={
                  reviews.find((r) => r.id === fullscreen.reviewId)!.images[
                    fullscreen.imageIndex
                  ]
                }
                alt="Full View"
                fill
                className="object-contain"
              />
            )}
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white text-3xl p-2 bg-black/50 rounded-full"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}

export default Reviews;
