import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/components/providers/theme-provider";
import { Toaster } from "sonner";
import { BlackjackButtons } from "@/lib/components/blackjack-menu";
import type { PropsWithChildren } from "react";
import type { Component } from "@/lib/components/utils/component";
import { BlackjackProvider } from "@/lib/hooks/use-blackjack";

const monterserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blackjack",
  applicationName: "Gaëtan - Portfolio",
  description: "A card game (Blackjack) made for fun that can be played solo or multiplayer (multiple players with their own deck).",
  keywords: ["card", "game", "blackjack", "multiplayer", "solo", "fun", "Gaëtan", "Portfolio"],
  openGraph: {
    title: "Blackjack",
    description: "A card game (Blackjack) made for fun that can be played solo or multiplayer (multiple players with their own deck).",
    type: "website",
    url: "https://preview.steellgold.fr/blackjack",
    siteName: "Gaëtan - Portfolio",
    images: [
      {
        url: "https://preview.steellgold.fr/blackjack-og.png",
        width: 1200,
        height: 630,
        alt: "Blackjack Open Graph Image",
      },
    ],
  },
  twitter: {
    images: [
      {
        url: "https://preview.steellgold.fr/blackjack-og.png",
        width: 1200,
        height: 630,
        alt: "Blackjack Open Graph Image",
      },
    ],
    title: "Blackjack",
    description: "A card game (Blackjack) made for fun that can be played solo or multiplayer (multiple players with their own deck).",
  }
};

export const viewport: Viewport = {
  themeColor: "#17552f"
};

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`rounded-lg ${monterserrat.className} antialiased bg-background dark:bg-[#121212]`}>        
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <div className="flex items-center justify-center h-screen w-screen bg-green-900 relative text-white">
            <BlackjackButtons />
            
            <Toaster richColors />

            <BlackjackProvider>
              {children}
            </BlackjackProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default Layout;
