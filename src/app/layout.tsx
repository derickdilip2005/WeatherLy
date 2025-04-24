import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FaLinkedin } from "react-icons/fa";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeatherLy",
  description: "Real-time weather forecasting application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <header className="fixed top-4 left-4 z-50">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent tracking-tight">
            WeatherLy
          </h1>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="text-center py-6 mt-8 border-t border-red-500/20 bg-[#1c1917]">
          <div className="flex flex-col items-center gap-2 relative">
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
              <span className="text-red-400">Connect with me</span>
              <a
                href="https://www.linkedin.com/in/derick-dilip-17751b282/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-500 transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
            <p className="text-red-400">
              Website Developed by Derick Dilip
            </p>
            <p className="text-red-400/80 text-sm">
              © 2025. All Rights Reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
