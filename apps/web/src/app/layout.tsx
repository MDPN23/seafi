import type { Metadata } from "next";
import "./globals.css";
import { AccountKitProvider } from "@/components/AccountKitProvider";

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
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100">
        <AccountKitProvider>{children}</AccountKitProvider>
      </body>
    </html>
  );
}
