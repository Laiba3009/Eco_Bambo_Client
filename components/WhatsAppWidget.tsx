"use client";

import { useState } from "react";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const phone = "923416995870";

  function openWhatsApp(message: string) {
    const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(link, "_blank");
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Chat on WhatsApp"
        className="
          fixed bottom-5 right-5
          w-[52px] h-[52px] rounded-[32px]
          bg-gradient-to-br from-black to-[#b8860b]
          text-white text-[21px]
          flex items-center justify-center
          shadow-[0_10px_24px_rgba(0,0,0,0.22)]
          z-[999999]
          transition-transform duration-300
          hover:scale-110 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)]
          before:content-[''] before:absolute before:inset-0
          before:rounded-[32px] before:bg-black
          before:-z-10 before:animate-[pulse_2s_infinite]
        "
      >
        <i className="fa-brands fa-whatsapp"></i>
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 flex items-center justify-center p-5 transition-all duration-300 z-[1000000] ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Popup Content */}
        <div
          className={`
            bg-white rounded-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.24)]
            w-full max-w-[480px] p-6 relative transform transition-transform duration-300
            ${open ? "translate-y-0" : "translate-y-5"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-2xl text-black/60 hover:text-black transition"
          >
            ×
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-[50px] h-[50px] rounded-full bg-black text-white flex items-center justify-center text-2xl">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Customer Support</h3>
              <p className="text-sm opacity-80">
Typically replies instantly

</p>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <textarea
              id="waMessage"
              defaultValue="Hi'/ Assalamu Alaikum! I’m interested in your bamboo creations. Can you assist me?"
              className="p-3 border border-gray-300 rounded-xl text-base resize-y min-h-[100px]"
            />
            <button
              onClick={() => {
                const msg =
                  (
                    document.getElementById("waMessage") as HTMLTextAreaElement
                  )?.value ||
                  "Salam! I’m interested in your bamboo creations. Can you assist me?";
                openWhatsApp(msg);
                setOpen(false);
              }}
              className="bg-black text-white rounded-xl px-6 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-[#b8860b] transition"
            >
              <i className="fa-brands fa-whatsapp"></i> Send
            </button>
          </div>
        </div>
      </div>

      {/* FontAwesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />

      {/* Custom Keyframes */}
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
