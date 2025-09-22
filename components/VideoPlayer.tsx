import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const VideoPlayer = () => {
  const iframeRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: isMuted ? "unMute" : "mute",
        args: [],
      }),
      "*"
    );
    setIsMuted(!isMuted);
  };

  // Track when title is in view
  const { ref: titleRef, inView } = useInView({
    triggerOnce: false, // true: animate once; false: animate every time it comes into view
    threshold: 0.2, // 20% visible
  });

  return (
    <div className="w-full py-12 text-center">
      {/* Title with Framer Motion animation */}
      <motion.h2
        ref={titleRef}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-[24px] md:text-[28px] font-bold text-[#000000] font-dm"
      >
        Best Plants for Bedroom Setup Tutorial – Watch & Learn!
      </motion.h2>

      {/* Down Arrow Icon */}
      <div className="text-3xl mt-5 mb-6 animate-bounce">⬇️</div>

      {/* Responsive YouTube Player */}
      <div
        className="relative pt-[56.25%] w-full rounded-xl overflow-hidden shadow-xl cursor-pointer"
        onClick={toggleMute}
      >
        <iframe
          ref={iframeRef}
          className="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/hw1wqsJ9Xic?si=0nToBLAdmZrkYbNp&autoplay=1&mute=1&enablejsapi=1"
          title="Best Plants Tutorial"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>

        {/* Mute Hint */}
        {isMuted && (
          <div className="absolute bottom-3 right-3 bg-black text-white text-xs px-2 py-1 rounded opacity-80">
            🔇 Click to unmute
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
