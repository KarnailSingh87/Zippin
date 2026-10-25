import "../styles/globals.css";
import AdminLayout from "../components/AdminLayout";
import { ThemeProvider } from "../context/ThemeContext";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Head>
        <title>Zippin Admin Console</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0C831F" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      </Head>
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    </ThemeProvider>
  );
}
