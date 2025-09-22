import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider } from "@/context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </CartProvider>
  );
}
