import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "iib Group HR Portal",
  description:
    "Human Resources Management System for iib Group — corporate banking excellence in people operations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-50 font-sans text-slate-700 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
