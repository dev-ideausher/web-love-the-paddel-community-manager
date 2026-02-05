import "@/global.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import { NotificationProvider } from "@/context/NotificationContext";
import { NotificationListener } from "@/Global/NotificationListener";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/Favicon.svg" />
        <title>Love The Padel</title>
        <meta name="description" content="web-love-the-padel" />
      </Head>

      {/* 🔑 WRAP EVERYTHING WITH THE PROVIDER */}
      <NotificationProvider>
        <NotificationListener />

        <main className="relative font-helvetica-neue">
          <Component {...pageProps} />

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </main>
      </NotificationProvider>
    </>
  );
}
