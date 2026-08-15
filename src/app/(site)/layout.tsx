import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import MotionProvider from "@/components/MotionProvider";
import Preloader from "@/components/Preloader";
import { getSiteSettings } from "@/lib/content";
import "../globals.css";

// ISR: pages regenerate at most every 5 minutes; Payload hooks revalidate
// immediately on every content change.
export const revalidate = 300;

// The type system is a pair, not a switcher: an editorial serif carries display
// moments, Inter carries everything a reader actually has to read. Both are
// variable fonts, so each ships one file covering its whole weight axis.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans-var",
  display: "swap",
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
      images: [site.shareImage],
      type: "website",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} font-sans antialiased`}>
        <Preloader />
        <LenisProvider>
          <MotionProvider>{children}</MotionProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
