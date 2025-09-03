import "@/styles/globals.css";
import "@/styles/TextSlider.css";
import type { AppProps } from "next/app";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppWidget from "../components/WhatsAppWidget";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <Header />
      <Component {...pageProps} />
      <Footer />
      <WhatsAppWidget /> {/* ✅ yahan har page pe button show hoga */}
    </div>
  );
}
