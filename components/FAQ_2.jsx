import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const flowerPotFaqs = [
  {
    question: "What Size is This Handmade Bamboo Planter? Is it for Indoor Use?",
    answer:
      "This is a versatile medium-sized bamboo flower pot, perfectly designed for indoor tabletops and surfaces. Its balanced size makes it ideal for placing on office desks, restaurant tables, coffee tables, console tables, or kitchen counters. It is substantial enough to hold beautiful artificial plants or small real ones while remaining compact enough to fit elegantly in any setting without occupying too much space.",
  },
  {
    question: "What Color Options Are Available for This Eco-Friendly Vase?",
    answer:
      "To complement various decors, this artisan planter is available in three distinct, hand-finished colors:\n\n- Classic Natural Bamboo: For an organic, minimalist look.\n- Vibrant Red: To add a bold and passionate accent to your space.\n- Sunny Yellow: For a cheerful and energetic pop of color.\n\nEach color is enhanced with a protective varnish that adds a beautiful shine and highlights the natural bamboo texture.",
  },
  {
    question: "Can This Bamboo Pot Be Used in Commercial Spaces Like Restaurants?",
    answer:
      "Absolutely! This is one of its primary strengths. Its unique, handcrafted design makes it an exceptional choice for commercial decor. It serves as a perfect table centerpiece in restaurants, cafes, and hotel lobbies. It also enhances reception desks and office waiting areas, creating a natural and sophisticated ambiance that impresses clients and guests alike.",
  },
  {
    question: "How Does the Borax Treatment Make This Bamboo Pot Durable?",
    answer:
      "We treat our bamboo with a special Borax and Boric Oxide solution. This chemical treatment is a game-changer for durability. It effectively protects the bamboo from termites, other insects, and decay, significantly extending its lifespan. This ensures your planter remains beautiful and structurally sound for years, making it a sustainable and long-lasting decor choice.",
  },
  {
    question: "Is This Flower Pot Easy to Style on a Tabletop?",
    answer:
      "Extremely easy. Its self-contained design means it requires no additional mounting or assembly. Simply place it on any flat surface, and it instantly elevates the aesthetics of the area. It pairs wonderfully with other bamboo accessories, books, or desk items, making it a hassle-free solution for adding a touch of nature to your home or office decor.",
  },
  {
    question: "Why is This Considered a Premium Gift Idea for Plant Lovers?",
    answer:
      "This isn't just a pot; it's a piece of functional art. Because each item is handmade, no two are exactly alike, offering a unique and personal touch. Its eco-friendly materials, artisanal craftsmanship, and elegant design make it a far more thoughtful and premium gift than a mass-produced alternative. It's an ideal present for housewarmings, birthdays, corporate gifts, or as a special treat for anyone who appreciates sustainable and beautiful home accessories.",
  },
];

const FlowerPotFAQSection = () => {
      const [openIndex, setOpenIndex] = useState(null);
        
          const toggleFAQ = (index) => {
            setOpenIndex((prev) => (prev === index ? null : index));
          };


   return (
     <section className="w-full px-0 py-8 sm:py-12 md:py-16 bg-white">
       {/* Title */}
       <motion.h2
         className="text-[30px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-bold text-[#000000] font-dm mb-10 leading-snug text-center"
         initial={{ opacity: 0, y: 30 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.4 }}
         viewport={{ once: true }}
       >
         Everything You Need to Know
       </motion.h2>
 
       {/* FAQ Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {faqs.map((faq, index) => (
           <div
             key={index}
             onClick={() => toggleFAQ(index)}
             className="rounded-md p-4 sm:p-5 md:p-6 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
           >
             <div className="flex justify-between items-center">
               <p className="font-semibold text-sm sm:text-base md:text-lg text-gray-800">
                 {faq.question}
               </p>
 
               <motion.div
                 initial={false}
                 animate={{ rotate: openIndex === index ? 180 : 0 }}
                 transition={{ duration: 0.2 }}
               >
                 {openIndex === index ? (
                   <FiMinus className="text-xl text-gray-600" />
                 ) : (
                   <FiPlus className="text-xl text-gray-600" />
                 )}
               </motion.div>
             </div>
 
             <AnimatePresence mode="wait">
               {openIndex === index && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: "auto" }}
                   exit={{ opacity: 0, height: 0 }}
                   transition={{ duration: 0.25 }}
                   className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line"
                 >
                   {faq.answer}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
         ))}
       </div>
     </section>
   );
 };

export default FlowerPotFAQSection;
