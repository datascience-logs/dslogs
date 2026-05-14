import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/constants";
import { Toaster } from 'react-hot-toast';
import ClientCleanup from "@/components/ClientCleanup";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-head",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.fullName}`,
  description: "Unlock exclusive data science cheat sheets, interview guides, and project templates with your Dslogs Instagram code.",
  keywords: "data science, machine learning, SQL, Python, resources, cheat sheet",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${GeistSans.variable} ${GeistMono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-body), sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <ClientCleanup />
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
