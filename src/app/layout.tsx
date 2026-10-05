import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { ScrollProvider } from "@/components/layout/ScrollProvider";
import { site } from "@/data/site";
import "./globals.css";

// Variable width axis: one family covers the condensed display and the wide titles.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
  },
  // Concept project: keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <body>
        <noscript>
          <style>{".preloader{display:none}"}</style>
        </noscript>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[110] -translate-y-20 bg-orange px-4 py-3 label text-ink focus:translate-y-0"
        >
          Skip to content
        </a>
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
