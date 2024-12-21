import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Component } from "@/lib/components/utils/component";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "@/lib/components/providers/theme-provider";
import { Toaster } from "sonner";

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
        {process.env.NEXT_PUBLIC_ENV !== "dev" && (
          <script defer src="https://www.woyage.app/track.js" data-website-id="ffd6eb05-59b1-4fa2-8a47-225c12ca64f8"></script>
        )}
        
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <Toaster richColors />

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

export default Layout;
