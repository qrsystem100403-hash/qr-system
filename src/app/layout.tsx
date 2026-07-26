import type { Metadata } from "next";
import { Libre_Baskerville, Manrope, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Friends Cafe Chopati",
  description: "Premium QR ordering system for restaurants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${libreBaskerville.variable} ${manrope.variable} font-[var(--font-body)]`}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}