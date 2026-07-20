import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplitHeadline from "@/components/SplitHeadline";
import PhotoFan from "@/components/PhotoFan";
import FourWayTest from "@/components/FourWayTest";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import { getAboutContent, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Discover the 15-year journey, legacy, and evolution of Rotaract Coimbatore Gaalaxy — from charter to today.",
};

export default async function AboutPage() {
  const [site, about] = await Promise.all([getSiteSettings(), getAboutContent()]);

  return (
    <>
      <Header tone="light" />
      <main>
        <section className="pt-48 max-md:pt-32">
          <div className="shell">
            <SplitHeadline
              as="h1"
              lines={[
                <span key="l1">
                  Fifteen years <span className="text-starlight">✦</span>
                </span>,
                "of force.",
              ]}
              className="text-center text-[100px] font-extrabold leading-[1.05] tracking-tight text-ink max-lg:text-[64px] max-md:text-[44px]"
            />
          </div>
          <div className="mt-24 max-md:mt-12">
            <PhotoFan images={about.storyImages} />
          </div>
        </section>

        {/* Story editorial */}
        <section className="py-28 max-md:py-16">
          <div className="shell flex gap-16 max-lg:flex-col">
            <div className="w-2/5 max-lg:w-full">
              <div className="sticky top-28">
                <p className="text-[17px] font-medium lowercase text-ink/40">our story</p>
                <SplitHeadline
                  lines={["Born", "30 November,", "2009."]}
                  className="mt-4 text-[42px] font-extrabold leading-[1.1] text-ink max-md:text-[32px]"
                />
              </div>
            </div>
            <div className="flex-1 space-y-6 text-[17px] font-medium leading-relaxed text-ink/70">
              {about.storyParagraphs.map((text, i) => (
                <Reveal key={i} y={30} scale={false} delay={i * 0.05}>
                  <p>{text}</p>
                </Reveal>
              ))}
              <Reveal y={30} scale={false} delay={0.15}>
                <blockquote className="border-l-4 border-starlight pl-6 text-[24px] font-extrabold leading-snug text-ink">
                  But we are not just a club — we are a force.
                </blockquote>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section className="starfield bg-space py-24">
          <div className="shell space-y-6">
            {about.manifesto.map((m, i) => (
              <Reveal key={m.text} y={50} scale={false} delay={i * 0.12}>
                <p className={`text-[56px] font-extrabold leading-[1.1] max-lg:text-[40px] max-md:text-[28px] ${m.accent}`}>{m.text}</p>
              </Reveal>
            ))}
            <Reveal y={30} scale={false} delay={0.4}>
              <p className="max-w-2xl pt-6 text-[17px] font-medium leading-relaxed text-white/60">
                Whether it&apos;s celebrating ability through sports, fueling social entrepreneurship, feeding the underserved, or inspiring the next generation of leaders — we lead not for applause, but for impact.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Timeline */}
        <section className="bg-mist py-24 max-md:py-16">
          <div className="shell">
            <SplitHeadline
              lines={["The journey", "so far."]}
              className="max-w-xl text-[42px] font-extrabold leading-[1.1] text-ink max-md:text-[32px]"
            />
            <ol className="mt-14 space-y-0">
              {about.timeline.map((t, i) => (
                <Reveal key={t.year} y={40} scale={false} delay={i * 0.05}>
                  <li className="grid grid-cols-[140px_1fr] gap-8 border-t border-ink/10 py-8 max-md:grid-cols-1 max-md:gap-2">
                    <span className="text-[42px] font-extrabold leading-none text-ink/20">{t.year}</span>
                    <div>
                      <h3 className="text-[22px] font-extrabold text-ink">{t.title}</h3>
                      <p className="mt-2 max-w-2xl text-[17px] font-medium leading-relaxed text-ink/60">{t.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Prayer */}
        <section className="starfield bg-space py-28 max-md:py-16">
          <div className="shell flex flex-col items-center text-center">
            <Image src="/images/brand/prayer.webp" alt="Rotaract" width={88} height={88} className="h-22 w-22 object-contain" />
            <p className="mt-4 text-[17px] font-medium lowercase text-white/40">the rotaract prayer</p>
            <Reveal y={30} scale={false}>
              <p className="mx-auto mt-8 max-w-3xl text-[24px] font-bold leading-relaxed text-white/90 max-md:text-[18px]">
                {site.prayer}
              </p>
            </Reveal>
          </div>
        </section>

        <FourWayTest />

        {/* Affiliation */}
        <section className="border-t border-ink/5 bg-white py-14">
          <Marquee>
            {[
              "Rotary International",
              site.district,
              "Rotary Club of Coimbatore Gaalaxy",
              `Club ID ${site.clubId}`,
              site.group,
              "Chartered 2009",
            ].map((label) => (
              <span key={label} className="flex items-center gap-4 text-[28px] font-extrabold text-ink/20">
                {label}
                <span className="text-[16px] text-starlight">✦</span>
              </span>
            ))}
          </Marquee>
        </section>

        <CTABanner />
      </main>
      <Footer site={site} />
    </>
  );
}
