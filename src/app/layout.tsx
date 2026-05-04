import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smit Patil | AI Software Engineer",
  description: "A high-end scrollytelling personal portfolio website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <Preloader />
        <Cursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
