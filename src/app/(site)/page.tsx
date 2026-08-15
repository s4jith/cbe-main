import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Hero from "@/components/Hero";
import Headline from "@/components/Headline";
import AvenueList from "@/components/AvenueList";
import AvenueDeck from "@/components/avenue-deck/AvenueDeck";
import FlagshipStory from "@/components/FlagshipStory";
import FourWayTest from "@/components/FourWayTest";
import BoardShowcase from "@/components/BoardShowcase";
import FaqAccordion from "@/components/FaqAccordion";
import CTABanner from "@/components/CTABanner";
import Marquee from "@/components/Marquee";
import { ArrowButton } from "@/components/Buttons";
import * as D from "@/lib/defaults";
import CurtainIntro from "@/components/CurtainIntro";
import ProjectShowcase from "@/components/ProjectShowcase";
import {
  fill,
  getAvenues,
  getBoardYears,
  getFaqs,
  getFeaturedProjects,
  getFlagship,
  getHomeContent,
  getHomeIntro,
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

/** "We don't serve, we rise." → ["We don't serve,", "we rise."] */
function splitHeadline(headline: string): string[] | null {
  const trimmed = headline.trim();
  if (!trimmed) return null;
  const comma = trimmed.indexOf(",");
  if (comma === -1 || comma === trimmed.length - 1) return [trimmed];
  return [trimmed.slice(0, comma + 1), trimmed.slice(comma + 1).trim()];
}

export default async function Home() {
  const site = await getSiteSettings();
  const home = getHomeContent();
  const [projects, featured, flagship, board, boardYears, avenues, intro, faqs] =
    await Promise.all([
      getProjects(),
      getFeaturedProjects(7),
      getFlagship(),
      getMembers("board"),
      getBoardYears(),
      getAvenues(),
      getHomeIntro(),
      getFaqs(),
    ]);
  const vars = siteVars(site, { count: projects.length });

  // The hero sets its second line in display italic, so the editable headline is
  // split at its comma — "We don't serve, we rise." lands as the statement and
  // then the turn. A headline without one simply falls back to the default pair.
  const introLines = splitHeadline(intro.headline) ?? home.hero.headline.lines;

  // Project counts per avenue, resolved once for the avenue index.
  const counts = Object.fromEntries(
    home.avenues.map((a) => [a.key, projects.filter((p) => p.avenue === a.key).length]),
  );

  return (
    <>
      <CurtainIntro intro={intro} />
      <SiteHeader tone="light" />
      <main id="main">
        <Hero
          eyebrow={D.home.heroEyebrow}
          lines={introLines}
          body={fill(home.hero.body, vars)}
          feature={D.home.heroFeature}
          primary={{ label: "Join our community", href: "/contact#say-hello" }}
          secondary={{ label: "See the work", href: "/projects" }}
          backdrop
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
              {avenues.length > 0 ? (
                <AvenueDeck avenues={avenues} />
              ) : (
                <AvenueList
                  avenues={home.avenues}
                  counts={counts}
                  countLabel={home.avenuesSection.countLabel}
                />
              )}
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

        {/* --- Our work ----------------------------------------------------- */}
        {featured.length > 0 && (
          <section className="section-y bg-paper">
            <div className="shell">
              <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8 max-lg:mb-10">
                <div className="lg:col-span-7">
                  <p className="eyebrow text-ink/45">What we have been doing</p>
                  <h2
                    className="headline mt-5 max-w-[12ch] text-ink"
                    style={{ "--h-min": "34px", "--h-max": "56px" } as React.CSSProperties}
                  >
                    Our projects.
                  </h2>
                </div>
                <div className="flex lg:col-span-5 lg:justify-end">
                  <ArrowButton href="/blog" variant="dark">
                    Read the stories
                  </ArrowButton>
                </div>
              </div>
              <ProjectShowcase projects={featured} />
            </div>
          </section>
        )}

        <FourWayTest />

        {/* --- Board -------------------------------------------------------- */}
        {board.length > 0 && (
          <section className="section-y bg-space text-paper">
            <div className="shell">
              <div className="mb-16 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8 max-lg:mb-10">
                <div className="lg:col-span-7">
                  <p className="eyebrow text-paper/40">
                    Get to know the people behind the club
                  </p>
                  <Headline
                    data={home.team.headline}
                    sizes={[52, 44, 32]}
                    className="mt-5 max-w-[12ch] text-paper"
                  />
                </div>
                <div className="flex lg:col-span-5 lg:justify-end">
                  <ArrowButton href="/team" variant="light">
                    {home.team.cta.label}
                  </ArrowButton>
                </div>
              </div>
              <BoardShowcase members={board} boardYears={boardYears} />
            </div>
          </section>
        )}

        {/* --- FAQ ---------------------------------------------------------- */}
        {faqs.length > 0 && (
          <section className="section-y bg-paper">
            <div className="shell">
              <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="eyebrow text-ink/45">Frequently asked</p>
                  <h2
                    className="headline mt-5 max-w-[12ch] text-ink"
                    style={{ "--h-min": "32px", "--h-max": "52px" } as React.CSSProperties}
                  >
                    Everything you need to know.
                  </h2>
                </div>
                <div className="lg:col-span-8">
                  <FaqAccordion items={faqs} />
                </div>
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
