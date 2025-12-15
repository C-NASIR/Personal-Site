import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import { siteMetadata } from "@/components/seo/metadata";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
        suppressHydrationWarning
      >
        {children}
        <AnalyticsProvider />
      </body>
    </html>
  );
}

