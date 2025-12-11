import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chrixlin",
  description: "Building scalable apps for web & mobile. Explore my portfolio of premium digital experiences.",
  keywords: ["web development", "mobile apps", "AI tools", "business solutions", "portfolio"],
  authors: [{ name: "Milton Raj" }],
  openGraph: {
    title: "Chrixlin",
    description: "Building scalable apps for web & mobile",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Chrixlin",
    type: "website",
  },
};

import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
