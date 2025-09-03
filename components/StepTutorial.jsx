 import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import GuideImage from "./GuideImage";

// Step Item
const StepItem = ({ step, index, onVisibleChange, isVisible }) => {
  const ref = useRef();
  const inView = useInView(ref, { threshold: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    onVisibleChange(index, inView);
    if (inView) controls.start("visible");
    else controls.start("hidden");
  }, [inView, controls, index, onVisibleChange]);

  const imageAnimation = {
    hidden: { opacity: 0, x: index % 2 === 0 ? -200 : 200 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  const textAnimation = {
    hidden: { opacity: 0, x: index % 2 === 0 ? 200 : -200 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <div
      ref={ref}
      className="relative flex flex-col md:flex-row items-center gap-6 mb-20 z-20"
    >
      {/* Step Number Circle (Only on md and above) */}
      <div className="absolute left-1/2 top-10 transform -translate-x-1/2 z-30 hidden md:flex">
        <motion.div
          className="rounded-full bg-black font-bold flex items-center justify-center"
          initial={{ scale: 1 }}
          animate={{ scale: isVisible ? 1.4 : 0.8 }}
          transition={{ duration: 0.3 }}
          style={{
            width: isVisible ? 28 : 20,
            height: isVisible ? 28 : 20,
            fontSize: "0.75rem",
            color: "rgb(184,134,11,1)",
          }}
        >
          {index + 1}
        </motion.div>
      </div>

      {/* Image */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={imageAnimation}
        className={`relative z-20 w-full md:w-1/2 ${
          index % 2 === 0 ? "order-1 md:order-1" : "order-1 md:order-2"
        }`}
      >
        <img
          src={step.image}
          alt={step.title}
          className="rounded w-full object-cover pr-4"
        />
      </motion.div>

      {/* Text */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={textAnimation}
        className={`relative z-20 w-full md:w-1/2 ${
          index % 2 === 0 ? "order-2 md:order-2" : "order-2 md:order-1"
        }`}
      >
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-black leading-snug">
          {step.title}
        </h3>
        <p className="text-md font- sm:text-2xl md:text-[22px] text-black leading-[1.3] px-3">
  {step.description}
    </p>


        
      </motion.div>
    </div>
  );
};

// Main Component
const StepTutorial = () => {
  const [steps, setSteps] = useState([]);
  const [visibleSteps, setVisibleSteps] = useState({});

  useEffect(() => {
    fetch("/data/product.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.steps) setSteps(data.steps);
      });
  }, []);

  const handleVisibleChange = (index, isVisible) => {
    setVisibleSteps((prev) => {
      if (prev[index] === isVisible) return prev;
      return { ...prev, [index]: isVisible };
    });
  };

  return (
      <section className="pt-10 pb-0 sm:py-10 w-full max-w-6xl mx-auto px-4 sm:px-3 relative">

      {/* Title with animation and spacing */}
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-xl sm:text-3xl md:text-4xl font-jost text-center text-black  mb-10 sm:mb-5 "
      >
        Best Plants for Bedroom Setup Tutorial - Watch & Learn!
      </motion.h2>

      {/* Center Line (Desktop only) */}
      <div className="absolute left-[calc(50%-1px)] top-[210px] bottom-[170px] w-[2px] bg-gray-300 z-0 hidden md:block" />


      {/* Steps */}
      <div className="relative z-20">
        {steps.map((step, index) => (
          <StepItem
            key={index}
            step={step}
            index={index}
            isVisible={visibleSteps[index] || false}
            onVisibleChange={handleVisibleChange}
          />
        ))}
      </div>
      <GuideImage />
    </section>
  );
};

export default StepTutorial;
