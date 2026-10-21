import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ui } from "@/i18n/ui";
import { SITE_ORIGIN, supabaseConfig } from "@/lib/config";
import "./globals.css";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;500;600&family=Noto+Serif+Thai:wght@400;500;600&display=swap";

const t = ui("en");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: t.meta.homeTitle, template: "%s · Khram" },
  description: t.meta.description,
  applicationName: "Khram",
  authors: [{ name: "Khram" }],
  openGraph: { type: "website", siteName: "Khram", locale: "en_US", title: t.meta.homeTitle, description: t.meta.description },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060F24",
  colorScheme: "dark",
};

/* Runs before first paint: marks JS as on, sets the page language for /th/ pages, shares the public Supabase settings with site.js. */
const boot = `document.documentElement.classList.add('js');if(/^\\/th(\\/|$)/.test(location.pathname)){document.documentElement.lang='th'}window.KHRAM_CFG=${JSON.stringify(supabaseConfig)};`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONTS} />
      </head>
      <body>
        {children}
        <script src="/site.js" defer />
      </body>
    </html>
  );
}
