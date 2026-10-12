import { Suspense } from "react";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Marque from "./components/Marque";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  subsets: ["latin"],
});

export const metadata = {
  title: "বাজার দর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ বাজারদর",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      data-theme="light"
      data-scroll-behavior="smooth"
      className={`${notoSansBengali.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense fallback={<div className="h-28 bg-base-100" />}>
          <Header />
        </Suspense>
        <Suspense fallback={<div className="h-9 border-y border-base-300 bg-base-100" />}>
          <Marque />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
