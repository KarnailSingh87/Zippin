import '../styles/globals.css';
import type { AppProps } from 'next/app';
import AdminLayout from '../components/AdminLayout';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Blinkit Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    </>
  );
}
