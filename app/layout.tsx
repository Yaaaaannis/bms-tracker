import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TournamentsProvider } from "@/lib/TournamentsContext";
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
  title: "BMS TRACKER - Esports Tournaments Tracking",
  description: "Suivez les prochains tournois esports de vos joueurs favoris en temps réel. Interface moderne et données live via l'API Start.gg.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TournamentsProvider>
          {children}
        </TournamentsProvider>
        <Analytics />
      </body>
    </html>
  );
}
