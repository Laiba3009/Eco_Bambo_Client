import { motion } from "framer-motion";

export default function AnimatedText({ text }) {
  return (
    <motion.h1
      className="text-3xl font-bold text-center mt-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.h1>
  );
}
