import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Safder Ali",
    image: "/images/image3.png",
    avatar: "/images/user.png",
    text: "I had a Bamboo Canopy and a Bamboo Roof on my Pergola built by EcoBamboo and it looks amazing They also constructed a Bamboo House which is not only eco-friendly but also beautifully designed. My Bamboo Gazebo has become the perfect spot for BBQ gatherings in my home. EcoBamboo's work is truly impressive!.",
  },
  {
    name: "David K",
    image: "/images/image2.png",
    avatar: "/images/user2.png",
    text: "I bought bamboo wall décor in small size from EcoBambo, and it looks amazing! It adds a natural touch to my kitchen and blends perfectly with my coastal farmhouse décor. The quality is great, and it's an affordable cheap wall décor option. Highly recommend for anyone looking to upgrade their room wall design Try Eco Bamboo for home decor..",
  },
  {
    name: "Zainab Malik",
    image: "/images/image7.png",
    avatar: "/images/user3.png",
    text: "I bought a bamboo flower pot with pots from EcoBambo and it's absolutely stunning It fits  with my indoor succulents and looks amazing as an outdoor flower planter. The craftsmanship is far better than other flower pots for sale, and the natural bamboo touch gives it a unique charm. Eco-friendly and makes my space feel more refreshing..",
  },
  {
    name: "Kingsley Chandler",
    image: "/images/image4.png",
    avatar: "/images/user4.png",
    text: "I bought a bamboo hanging wall décor (big size) from EcoBambo, and it's stunning! It blends beautifully with my lounge wall art and home wall art décor. The quality is far better than Wayfair and Amazon wall décor—natural, stylish, and eco-friendly! It's elegant, eco-friendly, and far better than any regular  décor!!",
  },
  {
    name: "Abid Hussain",
    image: "/images/image5.png",
    avatar: "/images/user5.png",
    text:"I bought a large bamboo flower  pot from EcoBambo and it has completely transformed my space. It looks perfect in my flower pots garden and also stands beautifully as a standing plant pot.  Whether indoors or as part of my flower pots for outside, this piece is an absolute showstopper.Truly this Eco Bambo Duarble for my house Thanks!",
  },
  {
    name: "John Deo",
    image: "/images/image6.png",
    avatar: "/images/user1.png",
    text: "EcoBamboo has transformed my space with its stunning collection The Bamboo Bed is elegant the  Sofa is stylish and the  Baby Chair and Bamboo Baby Bed are perfect for my little one. The Bamboo Chair is sturdy and beautiful while the Bamboo Sofa Tray Table adds convenience. Every piece is eco-friendly durable and   perfection.",
  },
];

const Reviews = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 3000); // faster rotation
    return () => clearInterval(timer);
  }, []);

  const handleSelect = (index) => {
    setCurrent(index);
  };

  return (
    <section className="max-w-6xl mx-auto py-14 px-4 sm:px-6">
      {/* Heading */}

      <motion.h2
 className="text-[20px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-bold text-[#000000] font-dm  text-center mb-10 leading-snug"
  initial={{ opacity: 0, scale: 0.8, y: -50 }}
  whileInView={{ opacity: 1, scale: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.35, ease: "easeOut", bounce: 0.4 }}
>
  Hear What Our Customers Say About Indoor Plant Wall!
</motion.h2>

      {/* Grid: Image + Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Image Slider */}
        <div className="relative w-full h-[300px] sm:h-[380px] md:h-[420px] rounded-xl overflow-hidden">
          {reviews.map((review, index) => (
            <img
              key={index}
              src={review.image}
              alt={review.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ease-in-out ${
                current === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition ${
                  current === index ? "bg-black" : "bg-gray-300"
                }`}
              ></button>
            ))}
          </div>
        </div>

        {/* Text Review */}
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-800"
        >
          <p className="text-black font-dm sm:text-lg italic mb-4 leading-relaxed">
            “{reviews[current].text}”
          </p>

          {/* Reviewer Info */}
          <div className="flex items-center gap-4">
            <img
              src={reviews[current].avatar}
              alt={reviews[current].name}
              className="w-12 h-12 rounded-full  object-cover"
            />
            <p className="text-sm sm:text-base font-semibold">
              {reviews[current].name}
            </p>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
