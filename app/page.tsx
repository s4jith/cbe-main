import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroShrink from "@/components/HeroShrink";
import HeroStrip from "@/components/HeroStrip";
import SplitHeadline from "@/components/SplitHeadline";
import AvenueCard from "@/components/AvenueCard";
import StatsOdometer from "@/components/StatsOdometer";
import ProgressTabs from "@/components/ProgressTabs";
import FourWayTest from "@/components/FourWayTest";
import PostCard from "@/components/PostCard";
import TeamSlider from "@/components/TeamSlider";
import CTABanner from "@/components/CTABanner";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import { ArrowButton } from "@/components/Buttons";
import { site } from "@/content/site";
import { avenues, projects, flagship } from "@/content/projects";
import { board, voices } from "@/content/members";

const avenueImages: Record<string, string> = {
  club: "/images/projects/club/06.jpg",
  community: "/images/projects/community/03.jpg",
  professional: "/images/projects/professional/05.jpg",
  international: "/images/projects/international/03.jpg",
  district: "/images/projects/district/05.jpg",
};

export default function Home() {
  return (
    <>
      <Header tone="light" />
      <main>
        {/* Hero */}
        <section className="pt-40 max-md:pt-32">
          <div className="shell">
            <HeroShrink>
              <SplitHeadline
                as="h1"
                lines={[
                  "We don't just serve.",
                  <span key="l2">
                    We lead <span className="text-starlight">✦</span> we rise.
                  </span>,
                ]}
                className="mx-auto max-w-4xl text-center text-[82px] font-extrabold leading-[1.08] tracking-tight text-ink max-lg:text-[56px] max-md:text-[40px]"
              />
              <p className="mx-auto mt-6 max-w-xl text-center text-[17px] font-medium leading-relaxed text-ink/60">
                {site.name} — {site.parent}. Youth-led service and leadership under {site.district}, Coimbatore. 15+ years of community impact, 500+ projects, and growing.
              </p>
            </HeroShrink>
          </div>
          <div className="mt-16">
            <HeroStrip />
          </div>
        </section>

        {/* Avenues */}
        <section className="starfield bg-space py-18">
          <div className="shell">
            <SplitHeadline
              lines={["Five avenues.", "One force."]}
              className="max-w-xl text-[42px] font-extrabold leading-[1.1] text-white max-md:text-[32px]"
            />
            <div className="mt-12 space-y-8">
              {avenues.map((a, i) => (
                <AvenueCard
                  key={a.key}
                  title={a.key}
                  blurb={a.blurb}
                  count={projects.filter((p) => p.avenue === a.key).length}
                  accent={a.accent}
                  image={avenueImages[a.slug]}
                  href={`/projects?avenue=${a.slug}`}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <StatsOdometer />

        {/* Flagship spotlight */}
        <section className="starfield bg-space py-24 max-md:py-16">
          <div className="shell">
            <SplitHeadline
              lines={["Built to", "break barriers."]}
              className="max-w-xl text-[42px] font-extrabold leading-[1.1] text-white max-md:text-[32px]"
            />
            <div className="mt-12">
              <ProgressTabs
                tabs={flagship.map((f) => ({
                  label: f.title,
                  title: f.tag,
                  body: f.description,
                  image: f.image,
                  stat: f.stat,
                }))}
              />
            </div>
          </div>
        </section>

        {/* Four-Way Test */}
        <FourWayTest />

        {/* Voices */}
        <section className="bg-mist pb-20 pt-6">
          <div className="shell">
            <SplitHeadline
              lines={["Voices from", "the galaxy."]}
              className="max-w-xl text-[42px] font-extrabold leading-[1.1] text-ink max-md:text-[32px]"
            />
            <div className="mt-12 grid grid-cols-3 gap-8 max-lg:grid-cols-1">
              {voices.map((v, i) => (
                <PostCard key={v.name} quote={v.quote} name={v.name} role={v.role} image={v.image} drift={[-40, 0, -18][i]} />
              ))}
            </div>
          </div>
        </section>

        {/* Stars teaser */}
        <section className="starfield bg-space pt-18">
          <div className="shell flex flex-wrap items-end justify-between gap-6">
            <SplitHeadline
              lines={["Meet the", "Stars of Gaalaxy."]}
              className="max-w-xl text-[42px] font-extrabold leading-[1.1] text-white max-md:text-[32px]"
            />
            <Reveal y={20} scale={false}>
              <ArrowButton href="/team" variant="light">View all stars</ArrowButton>
            </Reveal>
          </div>
          <div className="mt-10">
            <TeamSlider members={board.slice(0, 8)} />
          </div>
        </section>

        {/* Socials marquee */}
        <section className="bg-space py-12">
          <Marquee>
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-[42px] font-extrabold text-white/25 transition-colors hover:text-starlight"
              >
                {s.label}
                <span className="text-[20px] text-starlight">✦</span>
              </a>
            ))}
          </Marquee>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
