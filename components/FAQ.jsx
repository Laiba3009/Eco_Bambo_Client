import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What are Bamboo Wall Hangings Made Of? Are They Durable?",
    answer:
      "Our exquisite bamboo wall hangings are crafted from 100% natural, official bamboo and meticulously handcrafted by skilled artisans. To ensure exceptional durability and a long lifespan of 7–8 years, we treat the bamboo with a special chemical process involving Borax and Boric Oxide. This treatment not only strengthens the material but also makes it water-resistant and protects it from demokinesis (wear and tear). The final touch is a gleaming varnish that enhances its natural shine and provides an extra layer of weatherproofing.",
  },
  {
    question: "Where Can I Hang a Bamboo Wall Decoration in My Home?",
    answer:
      "The versatility of our handcrafted bamboo art is one of its key features! You can easily hang it to enhance the beauty of any wall, both indoors and outdoors. Popular spots include:\n\nIndoors: Living room (AFS wall), guest room, bedroom, farmhouse kitchen, or hallway.\n\nOutdoors: On a porch, pergola, or garden wall to complement your natural theme.\n\nCommercial Spaces: Perfect for adding an eco-chic vibe to restaurants, cafes, hotels, and lobbies. It serves as a stunning piece of custom-made art for any commercial property.",
  },
  {
    question: "Are These Handmade Bamboo Pieces Waterproof and Safe for Outdoor Use?",
    answer:
      "Yes, absolutely. A key feature of our bamboo wall decor is its water-resistant nature, thanks to the protective Borax treatment and a final coat of high-quality varnish. This makes it perfectly safe for outdoor use on covered porches, in gazebos, or under patio covers where it might be exposed to humidity or occasional moisture. It's designed to withstand the elements while maintaining its beautiful appearance.",
  },
  {
    question: "What Makes Your Bamboo Art a Unique Gift Idea?",
    answer:
      "Our handmade bamboo wall hangings are a uniquely thoughtful gift. Because they are handcrafted, each piece has its own unique character. They are a perfect gift for weddings, birthdays, housewarmings, or any special occasion. The natural, eco-friendly bamboo material and elegant design make it a gift that adds a touch of sophistication and natural beauty to any home or office, symbolizing good taste and a love for sustainable products.",
  },
  {
    question: "What Color and Finish Options Are Available?",
    answer:
      "We offer a range of beautiful finishes to match your decor. You can choose from the classic Natural Bamboo color to preserve its organic look, or opt for vibrant Red and Green finishes. Each piece is coated with a special varnish that gives it a shiny, attractive sheen, making the colors pop and ensuring the artwork becomes a captivating focal point on any wall.",
  },
  {
    question: "Why Should I Choose Handmade Bamboo Decor Over Metal or Plastic?",
    answer:
      "Choosing our handmade bamboo art means investing in sustainability, uniqueness, and quality. Unlike mass-produced metal or plastic decor, each of our pieces is handcrafted, ensuring you receive a one-of-a-kind item. Bamboo is a fast-growing, renewable resource, making it an eco-friendly choice. The craftsmanship and protective treatments ensure it is more durable and has a longer lifespan than many conventional alternatives, all while offering a warm, natural aesthetic that synthetic materials cannot replicate.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      {/* Title */}
      <motion.h2
        className="text-[30px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-bold text-[#000000] font-dm text-center mb-10 leading-snug"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        Everything You Need to Know
      </motion.h2>

      {/* FAQ Grid: 2 columns */}
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

export default FAQSection;
