import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";
import { birthdayConfig } from "@/config/birthdayConfig";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: `Happy Birthday ${birthdayConfig.recipientName}! ✨🎉`,
  description: `A magical, interactive birthday celebration for ${birthdayConfig.recipientName} with interactive cake, secret scratch memories, slot machine, and heartfelt letter.`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} ${caveat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans selection:bg-rose-200 selection:text-rose-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
