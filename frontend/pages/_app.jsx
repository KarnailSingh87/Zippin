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
            <meta name="theme-color" content="#FFE141" />
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/images/blinkit-app-icon.svg" />
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
