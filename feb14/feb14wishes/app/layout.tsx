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
  title: "Happy Valentine's Day & 4th Anniversary",
  description: "A special Valentine's Day wish celebrating 4 beautiful years together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-[#fce4ec] font-serif min-h-dvh overflow-x-hidden`}
        style={{ WebkitTapHighlightColor: "transparent" }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
