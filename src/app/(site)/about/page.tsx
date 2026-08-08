import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Headline from "@/components/Headline";
import Section, { Eyebrow, muted } from "@/components/Section";
import PhotoFan from "@/components/PhotoFan";
import FourWayTest from "@/components/FourWayTest";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import { alpha, cssColor } from "@/lib/theme";
import { fill, getAboutContent, getSiteSettings, siteVars } from "@/lib/content";

const ACCENT_VARS: Record<string, string> = {
  "text-comet": "var(--color-comet)",
  "text-starlight": "var(--color-starlight)",
  "text-cranberry": "var(--color-cranberry)",
};

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutContent();
  return {
    ...(about.seo.title ? { title: about.seo.title } : {}),
    ...(about.seo.description ? { description: about.seo.description } : {}),
    ...(about.seo.image ? { openGraph: { images: [about.seo.image] } } : {}),
    ...(about.seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function AboutPage() {
  const [site, about] = await Promise.all([getSiteSettings(), getAboutContent()]);
  const vars = siteVars(site);

  return (
    <>
      <SiteHeader tone="light" />
      <main>
        <Section surface={about.hero.surface} className="pt-48 max-md:pt-32">
          <div className="shell">
            <Headline
              data={about.hero.headline}
              as="h1"
              sizes={[100, 64, 44]}
              className="text-center font-extrabold leading-[1.05] tracking-tight"
              defaultColor="var(--color-ink)"
            />
          </div>
          {about.storyImages.length > 0 && (
            <div className="mt-24 max-md:mt-12">
              <PhotoFan images={about.storyImages} />
            </div>
          )}
        </Section>

        {/* Story editorial */}
        <Section surface={about.story.surface} className="py-28 max-md:py-16">
          <div className="shell flex gap-16 max-lg:flex-col">
            <div className="w-2/5 max-lg:w-full">
              <div className="sticky top-28">
                <Eyebrow tone={about.story.surface.tone} color={about.story.eyebrowColor}>
                  {about.story.eyebrow}
                </Eyebrow>
                <Headline
                  data={about.story.headline}
                  sizes={[42, 42, 32]}
                  className="mt-4 font-extrabold leading-[1.1]"
                  defaultColor="var(--color-ink)"
                />
              </div>
            </div>
            <div
              className="flex-1 space-y-6 text-[17px] font-medium leading-relaxed"
              style={{ color: muted(about.story.surface.tone, about.story.paragraphColor, 70) }}
            >
              {about.storyParagraphs.map((text, i) => (
                <Reveal key={i} y={30} scale={false} delay={i * 0.05}>
                  <p>{text}</p>
                </Reveal>
              ))}
              {about.story.quote && (
                <Reveal y={30} scale={false} delay={0.15}>
                  <blockquote
                    className="border-l-4 pl-6 text-[24px] font-extrabold leading-snug"
                    style={{
                      borderColor: cssColor(about.story.quoteBarColor, "var(--color-starlight)"),
                      color: cssColor(about.story.quoteColor, "var(--color-ink)"),
                    }}
                  >
                    {about.story.quote}
                  </blockquote>
                </Reveal>
              )}
            </div>
          </div>
        </Section>

        {/* Manifesto */}
        <Section
          surface={about.manifestoSection.surface}
          defaultBackground="var(--color-space)"
          className="py-24"
        >
          <div className="shell space-y-6">
            {about.manifesto.map((m, i) => (
              <Reveal key={m.text} y={50} scale={false} delay={i * 0.12}>
                <p
                  className="text-[56px] font-extrabold leading-[1.1] max-lg:text-[40px] max-md:text-[28px]"
                  style={{ color: cssColor(m.color, ACCENT_VARS[m.accent] ?? "var(--color-starlight)") }}
                >
                  {m.text}
                </p>
              </Reveal>
            ))}
            {about.manifestoSection.body && (
              <Reveal y={30} scale={false} delay={0.4}>
                <p
                  className="max-w-2xl pt-6 text-[17px] font-medium leading-relaxed"
                  style={{ color: muted(about.manifestoSection.surface.tone, about.manifestoSection.bodyColor) }}
                >
                  {about.manifestoSection.body}
                </p>
              </Reveal>
            )}
          </div>
        </Section>

        {/* Timeline */}
        <Section
          surface={about.timelineSection.surface}
          defaultBackground="var(--color-mist)"
          className="py-24 max-md:py-16"
        >
          <div className="shell">
            <Headline
              data={about.timelineSection.headline}
              sizes={[42, 42, 32]}
              className="max-w-xl font-extrabold leading-[1.1]"
              defaultColor={about.timelineSection.surface.tone === "dark" ? "var(--color-paper)" : "var(--color-ink)"}
            />
            <ol className="mt-14 space-y-0">
              {about.timeline.map((t, i) => (
                <Reveal key={t.year} y={40} scale={false} delay={i * 0.05}>
                  <li className="grid grid-cols-[140px_1fr] gap-8 border-t border-ink/10 py-8 max-md:grid-cols-1 max-md:gap-2">
                    <span
                      className="text-[42px] font-extrabold leading-none"
                      style={{ color: muted(about.timelineSection.surface.tone, about.timelineSection.yearColor, 20) }}
                    >
                      {t.year}
                    </span>
                    <div>
                      <h3
                        className="text-[22px] font-extrabold"
                        style={{ color: cssColor(about.timelineSection.titleColor, about.timelineSection.surface.tone === "dark" ? "var(--color-paper)" : "var(--color-ink)") }}
                      >
                        {t.title}
                      </h3>
                      <p
                        className="mt-2 max-w-2xl text-[17px] font-medium leading-relaxed"
                        style={{ color: muted(about.timelineSection.surface.tone, about.timelineSection.bodyColor) }}
                      >
                        {t.body}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </Section>

        {/* Prayer */}
        <Section
          surface={about.prayerSection.surface}
          defaultBackground="var(--color-space)"
          className="py-28 max-md:py-16"
        >
          <div className="shell flex flex-col items-center text-center">
            {about.prayerSection.image && (
              <Image
                src={about.prayerSection.image}
                alt="Rotaract"
                width={88}
                height={88}
                className="h-22 w-22 object-contain"
              />
            )}
            <Eyebrow tone={about.prayerSection.surface.tone} color={about.prayerSection.eyebrowColor} className="mt-4">
              {about.prayerSection.eyebrow}
            </Eyebrow>
            <Reveal y={30} scale={false}>
              <p
                className="mx-auto mt-8 max-w-3xl text-[24px] font-bold leading-relaxed max-md:text-[18px]"
                style={{ color: muted(about.prayerSection.surface.tone, about.prayerSection.textColor, 90) }}
              >
                {site.prayer}
              </p>
            </Reveal>
          </div>
        </Section>

        {about.showFourWayTest && <FourWayTest />}

        {/* Affiliation */}
        <Section
          surface={about.affiliation.surface}
          defaultBackground="var(--color-paper)"
          className="border-t border-ink/5 py-14"
        >
          <Marquee>
            {about.affiliation.items.map((label) => (
              <span
                key={label}
                className="flex items-center gap-4 text-[28px] font-extrabold"
                style={{ color: alpha(cssColor(about.affiliation.textColor, "var(--color-ink)"), 20) }}
              >
                {fill(label, vars)}
                <span
                  className="text-[16px]"
                  style={{ color: cssColor(about.affiliation.symbolColor, "var(--color-starlight)") }}
                >
                  {about.affiliation.symbol}
                </span>
              </span>
            ))}
          </Marquee>
        </Section>

        {about.showCta && <CTABanner />}
      </main>
      <SiteFooter />
    </>
  );
}
