import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import Preloader from "@/components/Preloader";
import { getSiteSettings } from "@/lib/content";
import "../globals.css";

// ISR: pages regenerate at most every 5 minutes; Payload hooks revalidate
// immediately on every content change.
export const revalidate = 300;

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — We are the force behind change`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      title: site.name,
      description: site.description,
      images: ["/images/brand/og-banner.jpg"],
      type: "website",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <Preloader />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
