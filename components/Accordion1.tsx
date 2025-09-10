"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const Accordion1: React.FC = () => {
  // ✅ Type fix: number | null
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const convertToHtml = (text: string) =>
    text
      .replace(/\n/g, "<br>")
      .replace(/–/g, "-")
      .replace(/×/g, "x")
      .replace(/≈/g, "~");

  const product = {
    description: `The Large Hanging Wall planter is designed to add a natural touch of greenery to your home or office. 
It comes with a stylish design that blends with both modern and traditional interiors. 
Perfect for indoor or outdoor decoration, this wall hanging planter enhances any space with its unique look.`,
    specification: `Product Name: Large Hanging Wall
Color: Green, Natural
Size: W 15 cm × H 44 cm
Package Includes: 1 Plant Leaf, 1 Stick`,
    warrantySupport: `Returns are accepted within 7 days of delivery in case of manufacturing defects or damage.
Contact: support@example.com with order number and issue proof (photo/video).
Used or modified items are non-returnable.`,
  };

  const sections = [
    { title: "Description", content: product.description },
    { title: "Specification", content: product.specification },
    { title: "Warranty & Support", content: product.warrantySupport },
  ];

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ✅ Type fix: string → parsed as { key, value }
  const parseSpecification = (specText: string) => {
    return specText.split("\n").map((line: string) => {
      const [key, ...rest] = line.split(":");
      return {
        key: key.trim(),
        value: rest.join(":").trim(),
      };
    });
  };

  return (
    <div className="my-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-4">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="group transition-all duration-200 px-3 py-4 rounded-xl shadow-sm bg-white hover:bg-gray-50"
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
                  {/* ✅ Specification Table */}
                  {section.title === "Specification" ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm text-gray-700 rounded-lg overflow-hidden border">
                        <tbody>
                          {parseSpecification(section.content).map(({ key, value }, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="px-4 py-2 font-semibold w-1/3 bg-gray-50">
                                {key}
                              </td>
                              <td className="px-4 py-2">{value}</td>
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

export default Accordion1;
