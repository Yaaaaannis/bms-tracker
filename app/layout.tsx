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
  keywords: ["esports", "tournois", "start.gg", "gaming", "compétition", "smash", "fighting games"],
  authors: [{ name: "BMS Team" }],
  creator: "BMS Team",
  publisher: "BMS",
  
  // Métadonnées Open Graph (Facebook, LinkedIn, Discord, etc.)
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://bms-tracker.vercel.app", // Remplacez par votre domaine
    siteName: "BMS TRACKER",
    title: "BMS TRACKER - Suivi de Tournois Esports",
    description: "Suivez les prochains tournois esports de vos joueurs BMS",
    images: [
      {
        url: "/og-image.png", // Vous devrez créer cette image (1200x630px recommandé)
        width: 1200,
        height: 630,
        alt: "BMS TRACKER - Suivi de Tournois Esports",
        type: "image/png",
      },
    ],
  },
  
  // Métadonnées Twitter Cards
  twitter: {
    card: "summary_large_image",
    site: "@Yannis_dev", // Remplacez par votre compte Twitter
    creator: "@Yannis_dev",
    title: "BMS TRACKER - Suivi de Tournois Esports",
    description: "Suivez les prochains tournois esports de vos joueurs BMS",
    images: ["/og-image.png"], // Image optimisée pour Twitter (1200x600px)
  },  
  
  // Métadonnées pour les robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Icônes et favicons
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.ico",
        color: "#BE2D39",
      },
    ],
  },
  
  // Métadonnées pour les PWA
  manifest: "/site.webmanifest",
  
  // Couleur du thème pour les navigateurs mobiles
  themeColor: "#BE2D39",
  
  // Verification pour les moteurs de recherche (optionnel)
  verification: {
    google: "votre-code-google-search-console",
    // bing: "votre-code-bing",
    // yandex: "votre-code-yandex",
  },
  
  // Métadonnées additionnelles
  category: "Gaming",
  classification: "Esports Tournament Tracking",
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
