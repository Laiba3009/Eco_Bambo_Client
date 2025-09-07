import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const planterFaqs = [
  {
    question: "What is the Ideal Use for a Large Bamboo Flower Pot Like This?",
    answer:
      "This large bamboo planter is designed to be a statement piece. Its generous size makes it perfect for holding bigger plant arrangements and creating a bold, natural focal point in any room. It is ideally used as a standalone decor element in living room corners, spacious lobbies, large office reception areas, restaurant entrances, or on either side of a doorway. It commands attention and adds a significant touch of eco-friendly elegance to expansive spaces.",
  },
  {
    question: "How Does the Larger Size Enhance Its Decorative Appeal?",
    answer:
      "The substantial size of this planter allows it to hold larger, lusher plants, creating an instant 'wow' factor. It fills empty corners beautifully, adds vertical interest with taller plants, and serves as a foundational element in your room's decor. Unlike smaller pots, it can single-handedly define the aesthetic of a space, making it ideal for those looking to make a strong design statement with a single, sustainable item.",
  },
  {
    question: "Is This Large Planter Stable and Durable Enough for Heavy Plants?",
    answer:
      "Absolutely. Despite being handmade, its construction is incredibly robust. The treatment with Borax and Boric Oxide not only protects it from insects and decay but also ensures the structure can easily support the weight of soil and larger plants. The wide base provides excellent stability, preventing it from tipping over, making it both a beautiful and practical choice for heavy-duty plant styling.",
  },
  {
    question: "Can I Customize This Large Bamboo Planter After Purchase?",
    answer:
      "Yes, one of the joys of owning a handcrafted item is the ability to personalize it. You can easily customize this planter to match your specific taste. You can paint it, add decorative ropes, or even stencil designs onto it using simple craft supplies. This flexibility allows you to create a truly one-of-a-kind piece that reflects your personal style and perfectly complements your home’s unique decor.",
  },
  {
    question: "Why Choose a Large Bamboo Pot Over Ceramic or Plastic for Outdoor Spaces?",
    answer:
      "For outdoor spaces like covered patios or balconies, this large bamboo pot offers distinct advantages. Its natural material blends seamlessly with garden environments. The water-resistant varnish protects it from humidity and occasional moisture far better than many ceramic pots that can crack or plastic pots that can fade and become brittle in the sun. It offers a more durable, aesthetic, and sustainable solution for outdoor plant decoration.",
  },
  {
    question: "Is This a Suitable Decorative Item for a Hotel or Resort Lobby?",
    answer:
      "Without a doubt. This large planter is an exceptional choice for hospitality decor. Its impressive size and unique, artisanal quality make it perfect for grand spaces like hotel lobbies, resort entrances, or corporate atriums. It creates a welcoming and luxurious natural ambiance that aligns perfectly with eco-conscious branding, leaving a lasting impression on guests and clients.",
  },
];

const PlanterFAQSection = () => {
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

export default PlanterFAQSection;
