import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntdProvider from "@/components/providers/AntdProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glums",
  description: "We're Glums, a powerhouse of digital strategists driving businesses to online success. Our mission: Provide you with tools for brand awareness and to achieve your online goals.",
  openGraph: {
    title: "PT. Cakra Dirga Askara",
    description: "We're Glums, a powerhouse of digital strategists driving businesses to online success. Our mission: Provide you with tools for brand awareness and to achieve your online goals.",
    siteName: "Glums",
    images: '/dummy/img-one.png',
    url: 'https://glums.id',
    type: 'website'
  },
  twitter: {
    card: "summary_large_image",
    title: "PT. Cakra Dirga Askara",
    description: "We're Glums, a powerhouse of digital strategists driving businesses to online success. Our mission: Provide you with tools for brand awareness and to achieve your online goals.",
    images: '/dummy/img-one.png',
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AntdProvider>
          {children}
        </AntdProvider>
      </body>
    </html>
  );
}
