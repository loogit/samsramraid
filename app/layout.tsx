import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE } from "@/lib/tiers";

const desc = "Sam Altman reportedly called the RAM in your PC 'quite terrible'. Find out if his strike team is coming for your 8, 16, 32, 64 or 128 GB. Free parody hardware audit. Shareable warrant included.";
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Is Sam Altman Coming for My RAM? The Altman Utilization Audit", template: "%s" },
  description: desc,
  keywords: ["Sam Altman RAM meme", "Sam Altman RAM in your PC", "tell Sam Altman GB of RAM it was me", "Cheeky Pint RAM", "RAM shortage meme", "am I safe from Sam Altman"],
  alternates: { canonical: "/" },
  openGraph: { title: "Is Sam Altman coming for my RAM?", description: desc, siteName: SITE.name, type: "website", images: ["/og"] },
  twitter: { card: "summary_large_image", title: "Is Sam Altman coming for my RAM?", description: desc, images: ["/og"] },
};
export const viewport: Viewport = { themeColor: "#050805" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    url: SITE.url,
    description: desc,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
  };
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
        {children}
      </body>
    </html>
  );
}
