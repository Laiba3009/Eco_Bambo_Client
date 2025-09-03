"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

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
    name: "Kingsley Chandler",
    images: ["/images/Sf1.jpg", "/images/Sf2.jpg", "/images/Sf3.jpg", "/images/Sf4.jpg"],
    avatar: "/images/user4.png",
    text: "I got a Small Flower Pot from EcoBamboo and it looks absolutely beautiful. The design is simple yet elegant, and it adds a natural charm to my home. EcoBamboo’s eco-friendly craftsmanship and quality are truly impressive!",
    rating: 5,
  },
  {
    id: 2,
    name: "Martha Lewis",
    images: ["/images/Hw1.png", "/images/Hw3.jpg", "/images/Hw9.JPG", "/images/Hw7.jpg"],
    avatar: "/images/user3.png",
    text: "I had a Large Hanging Wall, a Bamboo Canopy and a Bamboo Roof on my Pergola built by EcoBamboo and it looks amazing. They also constructed a Bamboo House which is not only eco-friendly but also beautifully designed. My Bamboo Gazebo has become the perfect spot for BBQ gatherings in my home. EcoBamboo's work is truly impressive!",
    rating: 4,
  },
  {
    id: 3,
    name: "Daniel Cooper",
    images: ["/images/Shw2.png", "/images/Shw9.JPG", "/images/Shw10.JPG"],
    avatar: "/images/user2.png",
    text: "I had a Small Hanging Wall installed by EcoBamboo and it instantly added a stylish and natural touch to my home. Along with this, I also got a Small Flower Pot which looks elegant and perfectly complements my space. EcoBamboo’s products are eco-friendly, beautifully designed, and of outstanding quality. Truly impressive work!",
    rating: 5,
  },
  {
    id: 4,
    name: "Maaz Khan",
    images: ["/images/Sf5.JPG", "/images/Sf4.JPG", "/images/Sf7.png"],
    avatar: "/images/user1.png",
    text: "Maine EcoBamboo ka Small Flower Pot liya aur woh bohot hi khubsurat lagta hai. Design simple lekin elegant hai, jo mere ghar ko natural aur stylish touch deta hai. EcoBamboo ki quality aur eco-friendly kaam waqai lajawab hai!",
    rating: 4,
  },
  {
    id: 5,
    name: "Michael Scott",
    images: ["/images/Shw7.jpg", "/images/Shw2.png", "/images/Shw4.png"],
    avatar: "/images/user5.png",
    text: "I recently added a Small Hanging Wall from EcoBamboo, and it has completely brightened up my space. The natural bamboo finish gives a fresh and modern look, while keeping it eco-friendly. I’m really impressed with the craftsmanship and quality EcoBamboo delivers!",
    rating: 5,
  },
  {
    id: 6,
    name: "Emma Watson",
    images: ["/images/Sf6.png", "/images/Sf3.JPG"],
    avatar: "/images/user.png",
    text: "The Small Flower Pot from EcoBamboo is such a charming addition to my home. Its simple yet stylish design blends perfectly with any décor, and the natural bamboo touch makes it truly unique. I love the eco-friendly quality EcoBamboo always delivers!",
    rating: 4,
  },
];

function Reviews(): JSX.Element {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<Record<number, number>>({});
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const cardsToShow = 3;
  const maxIndex = reviews.length - cardsToShow;

  const nextSlide = (): void => {
    if (startIndex < maxIndex) setStartIndex(startIndex + 1);
  };

  const prevSlide = (): void => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const visibleReviews = reviews.slice(startIndex, startIndex + cardsToShow);

  return (
    <section className="py-12 mt-15 bg-white relative">
      {/* Title with noticeable animation */}
<motion.h2
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: [1, 1.1, 1] }}
  transition={{
    duration: 1.5,
    ease: "easeInOut",
    repeat: Infinity, // loop forever
  }}
        className="text-xl sm:text-2xl md:text-4xl font-semibold text-center mb-8 text-black"
  style={{ color: "black" }}
>
Customer  Reviews
</motion.h2>


      <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto px-4">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          disabled={startIndex === 0}
          className="flex-shrink-0 p-3 bg-white shadow-md rounded-full hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous reviews"
        >
          <FaChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Reviews */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleReviews.map((review) => {
              const selectedIndex = selectedImages[review.id] || 0;
              const mainImage = review.images[selectedIndex];

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Main Image */}
                  <div className="mb-2 flex-shrink-0">
                    <img
                      src={mainImage}
                      alt={`Product from ${review.name}'s review`}
                      className="w-full h-48 object-cover rounded-md cursor-pointer"
                      onClick={() => setFullscreenImage(mainImage)}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src =
                          "https://placehold.co/400x300/cccccc/333333?text=Image+Not+Found";
                      }}
                    />
                  </div>

                  {/* Thumbnails */}
                  {review.images.length > 1 && (
                    <div className="flex gap-2 justify-center mt-2 mb-4">
                      {review.images.slice(0, 4).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          onClick={() => {
                            setSelectedImages((prev) => ({
                              ...prev,
                              [review.id]: index,
                            }));
                            setFullscreenImage(img); // Open fullscreen on click
                          }}
                          className={`w-12 h-12 object-cover rounded-md cursor-pointer border transition ${
                            selectedIndex === index
                              ? "border-[#b8860b]"
                              : "border-gray-200"
                          }`}
                        />
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
                    <img
                      src={review.avatar}
                      alt={`Avatar of ${review.name}`}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src =
                          "https://placehold.co/50x50/e0e0e0/0a0a0a?text=User";
                      }}
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
          className="flex-shrink-0 p-3 bg-white shadow-md rounded-full hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
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
              i === startIndex
                ? "bg-[#b8860b] w-6"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Review Counter */}
    

      {/* Fullscreen Image Viewer */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Full View"
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation(); // prevent closing when clicking button
              setFullscreenImage(null);
            }}
            aria-label="Close image viewer"
          >
            <IoClose />
          </button>
        </div>
      )}
    </section>
  );
}

export default Reviews;
