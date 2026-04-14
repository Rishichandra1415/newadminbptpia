import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BPTPIA Admin | Professional Management Dashboard",
  description: "Secure and scalable admin dashboard for BPTPIA",
};

import { ToastContainer } from "@/shared/components/ui/ToastContainer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full select-none" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full font-sans antialiased selection:bg-primary/20`}>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
