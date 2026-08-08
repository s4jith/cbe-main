import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Hero from "@/components/Hero";
import Headline from "@/components/Headline";
import AvenueList from "@/components/AvenueList";
import StatsEditorial from "@/components/StatsEditorial";
import FlagshipStory from "@/components/FlagshipStory";
import FourWayTest from "@/components/FourWayTest";
import TeamScroller from "@/components/TeamScroller";
import CTABanner from "@/components/CTABanner";
import Marquee from "@/components/Marquee";
import { ArrowButton } from "@/components/Buttons";
import * as D from "@/lib/defaults";
import {
  fill,
  getFlagship,
  getHomeContent,
  getMembers,
  getProjects,
  getSiteSettings,
  siteVars,
} from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const home = getHomeContent();
  return {
    ...(home.seo.title ? { title: home.seo.title } : {}),
    ...(home.seo.description ? { description: home.seo.description } : {}),
    ...(home.seo.image ? { openGraph: { images: [home.seo.image] } } : {}),
    ...(home.seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Home() {
  const site = getSiteSettings();
  const home = getHomeContent();
  const [projects, flagship, board] = await Promise.all([
    getProjects(),
    getFlagship(),
    getMembers("board"),
  ]);
  const vars = siteVars(site, { count: projects.length });

  // Project counts per avenue, resolved once for the avenue index.
  const counts = Object.fromEntries(
    home.avenues.map((a) => [a.key, projects.filter((p) => p.avenue === a.key).length]),
  );

  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <Hero
          eyebrow={D.home.heroEyebrow}
          lines={home.hero.headline.lines}
          body={fill(home.hero.body, vars)}
          feature={D.home.heroFeature}
          primary={{ label: "Join Us", href: "/join" }}
          secondary={{ label: "See the work", href: "/projects" }}
        />

        {/* --- Avenues: the editorial index + signature hover preview -------- */}
        <section className="section-y mt-24 bg-space text-paper max-lg:mt-16">
          <div className="shell">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <div className="lg:col-span-7">
                <p className="eyebrow text-paper/40">Five avenues</p>
                <Headline
                  data={home.avenuesSection.headline}
                  sizes={[52, 44, 32]}
                  className="mt-5 max-w-[14ch] text-paper"
                />
              </div>
              <div className="flex lg:col-span-5 lg:justify-end">
                <ArrowButton href="/projects" variant="light">
                  {home.avenuesSection.linkLabel}
                </ArrowButton>
              </div>
            </div>

            <div className="mt-16 max-lg:mt-10">
              <AvenueList
                avenues={home.avenues}
                counts={counts}
                countLabel={home.avenuesSection.countLabel}
              />
            </div>
          </div>
        </section>

        {/* --- Numbers ------------------------------------------------------ */}
        <section className="section-y bg-paper">
          <div className="shell">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <div className="lg:col-span-8">
                <p className="eyebrow text-ink/45">By the numbers</p>
                <Headline
                  data={home.statsSection.headline}
                  sizes={[52, 44, 32]}
                  className="mt-5 max-w-[14ch] text-ink"
                />
              </div>
            </div>
            <div className="mt-14 max-lg:mt-10">
              <StatsEditorial stats={home.stats} />
            </div>
          </div>
        </section>

        {/* --- Flagship story ----------------------------------------------- */}
        {flagship.length > 0 && (
          <section className="section-y bg-space text-paper">
            <div className="shell">
              <div className="mb-16 max-lg:mb-10">
                <p className="eyebrow text-paper/40">Flagship work</p>
                <Headline
                  data={home.flagship.headline}
                  sizes={[52, 44, 32]}
                  className="mt-5 max-w-[14ch] text-paper"
                />
              </div>
              <FlagshipStory items={flagship} />
            </div>
          </section>
        )}

        <FourWayTest />

        {/* --- Team --------------------------------------------------------- */}
        {board.length > 0 && (
          <section className="section-y bg-mist">
            <div className="shell">
              <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
                <div className="lg:col-span-7">
                  <p className="eyebrow text-ink/45">The team</p>
                  <Headline
                    data={home.team.headline}
                    sizes={[52, 44, 32]}
                    className="mt-5 max-w-[12ch] text-ink"
                  />
                </div>
                <div className="flex lg:col-span-5 lg:justify-end">
                  <ArrowButton href="/team" variant="dark">
                    {home.team.cta.label}
                  </ArrowButton>
                </div>
              </div>
              <div className="mt-14 max-lg:mt-10">
                <TeamScroller members={board.slice(0, home.team.limit)} />
              </div>
            </div>
          </section>
        )}

        {/* --- Socials marquee ---------------------------------------------- */}
        {site.socials.length > 0 && (
          <section className="border-y border-line bg-paper py-10">
            <Marquee>
              {site.socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  {...(s.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="marquee-link headline text-ink/25 transition-colors"
                  style={
                    {
                      "--h-min": "28px",
                      "--h-max": "40px",
                      "--marquee-hover": "var(--color-starlight-deep)",
                    } as React.CSSProperties
                  }
                >
                  {s.label}
                </Link>
              ))}
            </Marquee>
          </section>
        )}

        {home.showCta && <CTABanner />}
      </main>
      <SiteFooter />
    </>
  );
}
