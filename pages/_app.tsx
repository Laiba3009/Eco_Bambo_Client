import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider } from "@/context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDebugPanel from "../components/CartDebugPanel";
import CartErrorBoundary from "../components/CartErrorBoundary";
import { useEffect } from "react";
import WhatsAppWidget from "../components/WhatsAppWidget";
import cartLogger from "../lib/cartLogger";

export default function App({ Component, pageProps }: AppProps) {
  // Initialize cart system when app starts
  useEffect(() => {
    const initializeCartSystem = async () => {
      try {
        (cartLogger as any).operationStart('App', 'initializeCartSystem');
        
        // Initialize cart synchronization
        const { cartSyncService } = await import('../lib/cartSync');
        await cartSyncService.initialize();
        
        (cartLogger as any).operationSuccess('App', 'initializeCartSystem', {
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        (cartLogger as any).operationFailure('App', 'initializeCartSystem', error);
      }
    };

    initializeCartSystem();

    // Cleanup on unmount
    return () => {
      (cartLogger as any).info('App', 'Cleaning up cart system on unmount');
      import('../lib/cartSync').then(({ cartSyncService }) => {
        cartSyncService.stopPeriodicSync();
      }).catch((error) => {
        (cartLogger as any).warn('App', 'Failed to cleanup cart sync service', error);
      });
    };
  }, []);

  return (
    <CartErrorBoundary name="App">
      <CartProvider>
        <div className="w-full max-w-[100vw] overflow-x-hidden">
          <Header />
          <Component {...pageProps} />
          <Footer />
          {/* Debug panel for development */}
          <WhatsAppWidget/>
          <CartDebugPanel />
        </div>
      </CartProvider>
    </CartErrorBoundary>
  );
}
