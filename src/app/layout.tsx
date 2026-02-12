import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CompareProvider } from "@/context/CompareContext";
import Header from "@/components/Header";
import CompareTray from "@/components/CompareTray";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex — Browse & Compare Pokémon",
  description:
    "A modern Pokédex built with Next.js and the PokéAPI GraphQL endpoint. Search, filter, sort, and compare Pokémon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CompareProvider>
          <Header />
          <main className="mx-auto min-h-screen max-w-7xl px-4 pb-24 pt-6 sm:px-6">
            {children}
          </main>
          <CompareTray />
        </CompareProvider>
      </body>
    </html>
  );
}
