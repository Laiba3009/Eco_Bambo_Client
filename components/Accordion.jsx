import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const Accordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const convertToHtml = (text) =>
    text
      .replace(/\n/g, "<br>")
      .replace(/–/g, "-")
      .replace(/×/g, "x")
      .replace(/≈/g, "~");

  const product = {
    description: `Crafted from durable bamboo for long-lasting use. Enhance your garden with our large bamboo flower pot with stand — perfect for outdoor pots and planters. Designed for large flower pots, it adds elegance to any space. Ideal for flower pots for outside. 
Key Features:
• Best container plants for your space
• Premium quality for those looking to buy plant pots
• Perfect for flower pots for sale seekers
• Versatile choice for any setting
• Made with Dracaena Lucky Bamboo
• Free from harmful weather effects
• Easy on the pocket
• Made from sustainable bamboo with a natural look
Indoor Use:
• Long-lasting quality for indoor decor
• Suitable for all seasons
• Lightweight, durable & eco-friendly`, 
    specification: `Product Name:Bamboo Flower Pot - Perfect for Home & Garden
Material:100% sustainable, hand-woven bamboo (stronger than plastic alternatives)
Finish & Protection:UV-stable varnish, waterproof sealant, anti-insect chemical treatment (longer life, high gloss)
Weather Resistance:Fade-proof colour; safe from rain, sun (-5°C to 45°C) and high humidity
Dimensions / Size Options:Ø 25 cm x H 60 cm (Large), Ø 20 cm x H 45 cm (Medium)
Colour Choices:Natural Bamboo, Honey, Caramel ,Red , Yellow , Half White
Package Includes:1 x Bamboo Planter, 1 x Detachable Stand, Optional Artificial Lucky Bamboo Stems`,
    warrantySupport: `To return, email order number + issue proof (photo/video) to ecobambooarts@gmail.com.
Items returned without approval won't be accepted.
Inspect on delivery; report damage/defect immediately via email or +92 341 6995870.
Used/washed items are non-returnable.
Refunds within 10 business days after item inspection.`,
  };

  const sections = [
    { title: "Description", content: product.description },
    { title: "Specification", content: product.specification },
    { title: "Warranty & Support", content: product.warrantySupport },
  ];

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ✅ Convert specification string to an array of key-value pairs
  const parseSpecification = (specText) => {
    return specText.split("\n").map((line) => {
      const [key, ...rest] = line.split(":");
      return {
        key: key.trim(),
        value: rest.join(":").trim(),
      };
    });
  };

  return (
    <div className="my-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-4">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className={`group transition-all duration-200 px-3 py-4 rounded-xl shadow-sm ${
              index !== 0 ? "" : ""
            } bg-white hover:bg-gray-50`}
          >
            <button
              className="flex items-center justify-between w-full text-left text-[17px] sm:text-lg font-semibold text-gray-900"
              onClick={() => toggleSection(index)}
            >
              <span>{section.title}</span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 group-hover:bg-black group-hover:text-[#B8860B] transition-all duration-300">
                {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden mt-3"
                >
                  {/* ✅ Render table for Specification */}
                  {section.title === "Specification" ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm text-gray-700 rounded-lg overflow-hidden">
                        <tbody>
                          {parseSpecification(section.content).map(({ key, value }, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 font-semibold  w-1/3">{key}</td>
                              <td className="px-4 py-2 ">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div
                      className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: convertToHtml(section.content) }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
