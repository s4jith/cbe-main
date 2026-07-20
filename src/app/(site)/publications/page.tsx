import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplitHeadline from "@/components/SplitHeadline";
import TiltCard from "@/components/TiltCard";
import Reveal from "@/components/Reveal";
import { getPublications, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "The Gaalaxy Newsletter and annual scrapbooks — project highlights, events, and memorable moments in print.",
};

export default async function PublicationsPage() {
  const [site, newsletters, scrapbooks] = await Promise.all([
    getSiteSettings(),
    getPublications("newsletter"),
    getPublications("scrapbook"),
  ]);

  return (
    <>
      <Header tone="light" />
      <main>
        <section className="pt-48 pb-16 max-md:pt-32">
          <div className="shell">
            <SplitHeadline
              as="h1"
              lines={[
                <span key="l1">
                  Paper trails <span className="text-starlight">✦</span>
                </span>,
                "of impact.",
              ]}
              className="text-[100px] font-extrabold leading-[1.05] tracking-tight text-ink max-lg:text-[64px] max-md:text-[44px]"
            />
          </div>
        </section>

        {/* Newsletters */}
        <section className="bg-mist py-20">
          <div className="shell">
            <p className="text-[17px] font-medium lowercase text-ink/40">gaalaxy newsletter — monthly</p>
            <SplitHeadline
              lines={["Every edition,", "one voice."]}
              className="mt-3 max-w-xl text-[42px] font-extrabold leading-[1.1] text-ink max-md:text-[32px]"
            />
          </div>
          <div className="shell bleed-right mt-12 flex gap-8 overflow-x-auto pb-8">
            {newsletters.map((n, i) => (
              <Reveal key={n.title} delay={Math.min(i, 5) * 0.05} className="shrink-0">
                <a href={n.pdf} target="_blank" rel="noopener noreferrer" className="block">
                  <TiltCard className="relative h-[380px] w-[270px] overflow-hidden rounded-2xl shadow-card">
                    <Image src={n.cover} alt={`${n.title} newsletter cover`} fill sizes="270px" className="object-cover" />
                  </TiltCard>
                  <div className="mt-4 text-[20px] font-extrabold text-ink">{n.title}</div>
                  <div className="text-[14px] font-semibold text-ink/50">Open PDF ↗</div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Scrapbooks */}
        <section className="starfield bg-space py-24">
          <div className="shell">
            <p className="text-[17px] font-medium lowercase text-white/40">annual scrapbooks</p>
            <SplitHeadline
              lines={["Year by year,", "chapter by chapter."]}
              className="mt-3 max-w-xl text-[42px] font-extrabold leading-[1.1] text-white max-md:text-[32px]"
            />
            <div className="mt-14 grid grid-cols-5 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2">
              {scrapbooks.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.07}>
                  <a href={s.pdf} target="_blank" rel="noopener noreferrer" className="group block">
                    <TiltCard className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-card">
                      <Image src={s.cover} alt={`${s.title} scrapbook cover`} fill sizes="(max-width:768px) 50vw, 230px" className="object-cover" />
                    </TiltCard>
                    <div className="mt-4 text-[18px] font-extrabold text-white">{s.title}</div>
                    <div className="text-[14px] font-semibold text-white/40 transition-colors group-hover:text-starlight">Open PDF ↗</div>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer site={site} />
    </>
  );
}
