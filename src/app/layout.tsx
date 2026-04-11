import type { Metadata } from "next";
import { Fraunces, Literata, Press_Start_2P } from "next/font/google";
import { GlobalSoundToggle } from "@/components/GlobalSoundToggle";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Literata({
  subsets: ["latin"],
  variable: "--font-body",
});

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: {
    default: "The Grand Rainbow Conjunction",
    template: "%s · The Grand Rainbow Conjunction",
  },
  description:
    "The Grand Rainbow Conjunction — a medicine path through Hollywood, music production, long-haul miles, and life after the darkest frame.",
  openGraph: {
    title: "The Grand Rainbow Conjunction",
    description:
      "Stories and ceremony at The Grand Rainbow Conjunction: a shaman healer’s memoir in motion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${pixel.variable} min-h-screen font-body antialiased`}
      >
        {children}
        <GlobalSoundToggle />
      </body>
    </html>
  );
}
