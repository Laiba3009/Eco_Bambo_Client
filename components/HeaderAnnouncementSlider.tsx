import React, { useState } from "react";

const messages = [
  "Welcome to ECO Bambo !",
  "30% off on bamboo flower pot - order now !",
  "Free delivery in Pakistan",
  "New style bamboo arrivals"
];

export default function HeaderAnnouncementSlider() {
  const [current, setCurrent] = useState(0);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + messages.length) % messages.length);
  };
  const goNext = () => {
    setCurrent((prev) => (prev + 1) % messages.length);
  };

  return (
    <div className="w-full h-8 flex items-center justify-center overflow-hidden relative">
      <button
        onClick={goPrev}
        aria-label="Previous announcement"
        className="px-2 md:px-4 lg:px-8 h-full flex items-center justify-center text-black hover:opacity-70"
        style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer" }}
        tabIndex={0}
      >
        {'<'}
      </button>
      <span
        className="px-2 md:px-8 lg:px-16 whitespace-nowrap text-center font-semibold"
        style={{
          color: "#000",
          fontWeight: 350,
          fontSize: "1rem",
          letterSpacing: "0.02em",
          minWidth: 'max-content',
        }}
      >
      <div className="font-semibold">  {messages[current]} </div>
      </span>
      <button
        onClick={goNext}
        aria-label="Next announcement"
        className="px-2 md:px-4 lg:px-8 h-full flex items-center justify-center text-black hover:opacity-70"
        style={{ background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer" }}
        tabIndex={0}
      >
        {'>'}
      </button>
    </div>
  );
} 