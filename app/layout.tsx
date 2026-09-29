import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import SiteFooter from "@/components/SiteFooter";

import "./globals.css";
import PublicHeader from "@/components/PublicHeader";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blessed",
  description: "Blessed products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans antialiased`}>
        <PublicHeader />

        {children}

        <SiteFooter />
      </body>
    </html>
  );
}