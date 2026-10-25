import React, { useEffect } from "react";
import "../styles/globals.css";
import "leaflet/dist/leaflet.css";
import "../components/ui/motion-add-to-basket-utils/index.css";
import { AuthProvider } from "../context/AuthContext";
import { LocationProvider } from "../context/LocationContext";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "../context/ToastContext";
import Layout from "../components/Layout";
import Head from "next/head";
import Toast from "../components/Toast";
import { cacheManager } from "../lib/cacheManager";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    cacheManager.initAutoEviction();
  }, []);

  return (
    <AuthProvider>
      <LocationProvider>
        <ToastProvider>
          <CartProvider>
            <Head>
              <title>Zippin - Everything delivered in 8-10 minutes</title>
              <meta
                name="description"
                content="India's fastest delivery app. Buy milk, bread, butter, fresh fruits & vegetables, snacks, and daily groceries online with superfast 10-minute delivery."
              />
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1"
              />
              <meta name="theme-color" content="#FFFFFF" />
              <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
              <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
              <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
              <link rel="shortcut icon" href="/favicon.ico" />
              <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
            </Head>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <Toast />
          </CartProvider>
        </ToastProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
