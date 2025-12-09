import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import { Toaster } from "sonner";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus CCTV Monitoring System",
  description:
    "Professional campus security monitoring and management platform",
  authors: [{ name: "Rejoyan", url: "https://md-rejoyan-islam.github.io/" }],
  keywords: [
    "CCTV",
    "Campus Security",
    "Monitoring System",
    "Surveillance",
    "Security Management",
  ],
  openGraph: {
    title: "SUST Campus CCTV Monitoring System",
    description:
      "Professional campus security monitoring and management platform for SUST(Shahjalal University of Science and Technology).",
    url: "https://sust-cctv.neuronomous.net",
    siteName: "Campus CCTV Monitoring System",
    images: [
      {
        url: "https://sust-cctv.neuronomous.net/images/sust.png",
        width: 1200,
        height: 630,
        alt: "Campus CCTV Monitoring System",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased `}>
        <Providers>{children}</Providers>
        <Toaster
          closeButton
          toastOptions={{
            classNames: {
              error: "bg-red-500/80! text-white! border-red-600!",
              success: "bg-green-500! text-white! border-green-600!",
            },
          }}
        />
      </body>
    </html>
  );
}
