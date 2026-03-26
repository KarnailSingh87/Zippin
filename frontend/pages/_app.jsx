import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import Layout from "../components/Layout";
import Head from "next/head";
import Toast from "../components/Toast";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Head>
            <title>Blinkit - Grocery delivery in 10 minutes</title>
            <meta
              name="description"
              content="Get groceries, snacks, and essentials delivered to your door in 10 minutes. Browse categories, get great deals and free delivery on orders above ₹499."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
            <link
              rel="icon"
              href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>"
            />
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toast />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
