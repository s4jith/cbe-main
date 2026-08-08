import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Headline from "@/components/Headline";
import LegacyGallery from "@/components/LegacyGallery";
import CTABanner from "@/components/CTABanner";
import { getLegacyPhotos } from "@/lib/content";
import * as D from "@/lib/defaults";

export const metadata: Metadata = {
  title: D.legacy.seo.title,
  description: D.legacy.seo.description,
};

export default async function LegacyPage() {
  const photos = await getLegacyPhotos();

  return (
    <>
      <SiteHeader tone="light" />
      <main>
        <section className="pb-10 pt-32 lg:pt-40">
          <div className="shell">
            <p className="eyebrow text-ink/45">{D.legacy.heroEyebrow}</p>
            <Headline
              data={{ lines: D.legacy.heroHeadline }}
              as="h1"
              sizes={[68, 52, 34]}
              className="mt-4 max-w-[18ch] text-ink"
            />
            <p className="lede mt-7 max-w-[52ch] text-ink-soft">{D.legacy.intro}</p>
          </div>
        </section>

        <section className="pb-28 pt-8">
          <div className="shell">
            <LegacyGallery photos={photos} />
          </div>
        </section>

        <CTABanner />
      </main>
      <SiteFooter />
    </>
  );
}
