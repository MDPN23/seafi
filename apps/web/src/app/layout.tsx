import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrivyProviderWrapper } from "@/components/PrivyProviderWrapper";
import { Header } from "@/components/maincomp/Header";
import { Footer } from "@/components/maincomp/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SEAFI - Real-Time Salary & Yield Protocol",
  description: "Real-time salary streaming and automatic yield optimization built on Arbitrum Stylus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-black grain-bg">
        <PrivyProviderWrapper>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}

