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
            <title>Blinkit - Everything delivered in 8-10 minutes</title>
            <meta
              name="description"
              content="India's last minute app. Buy milk, bread, butter, fresh fruits & vegetables, snacks, and daily groceries online with superfast 10-minute delivery."
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1"
            />
            <link rel="icon" href="/images/logo.png" />
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
