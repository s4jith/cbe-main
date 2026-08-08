import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Headline from "@/components/Headline";
import Section, { Eyebrow, muted, solid } from "@/components/Section";
import PostCard from "@/components/PostCard";
import CTABanner from "@/components/CTABanner";
import Reveal from "@/components/Reveal";
import { cssColor } from "@/lib/theme";
import { getMembers, getTeamContent, getVoices } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getTeamContent();
  return {
    ...(page.seo.title ? { title: page.seo.title } : {}),
    ...(page.seo.description ? { description: page.seo.description } : {}),
    ...(page.seo.image ? { openGraph: { images: [page.seo.image] } } : {}),
    ...(page.seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function TeamPage() {
  const [board, generalMembers, voices, page] = await Promise.all([
    getMembers("board"),
    getMembers("general"),
    getVoices(),
    getTeamContent(),
  ]);
  const leadership = board.slice(0, page.leadership.count);
  const rest = board.slice(page.leadership.count);

  return (
    <>
      <SiteHeader tone="light" />
      <main>
        <Section surface={page.hero.surface} className="pt-48 pb-16 max-md:pt-32">
          <div className="shell">
            <Eyebrow tone={page.hero.surface.tone} color={page.hero.eyebrowColor} className="text-center">
              {page.hero.eyebrow}
            </Eyebrow>
            <Headline
              data={page.hero.headline}
              as="h1"
              sizes={[100, 64, 40]}
              className="mt-3 text-center font-extrabold leading-[1.05] tracking-tight"
              defaultColor="var(--color-ink)"
            />
          </div>
        </Section>

        {/* Leadership */}
        <Section surface={page.leadership.surface} className="pb-24">
          <div className="shell grid grid-cols-4 gap-6 max-lg:grid-cols-2">
            {leadership.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05}>
                <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl shadow-card">
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(max-width:1024px) 50vw, 280px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/55" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div
                      className="text-[18px] font-bold leading-tight"
                      style={{ color: cssColor(page.leadership.nameColor, "var(--color-paper)") }}
                    >
                      {m.name}
                    </div>
                    <div
                      className="mt-1 text-[13px] font-semibold"
                      style={{ color: cssColor(page.leadership.roleColor, "var(--color-starlight)") }}
                    >
                      {m.role}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* Rest of board */}
        {rest.length > 0 && (
          <Section surface={page.board.surface} defaultBackground="var(--color-space)" className="py-20">
            <div className="shell">
              <Headline
                data={page.board.headline}
                sizes={[42, 42, 32]}
                className="max-w-xl font-extrabold leading-[1.1]"
                defaultColor="var(--color-paper)"
              />
              <div className="mt-12 grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2">
                {rest.map((m, i) => (
                  <Reveal key={m.name} delay={(i % 4) * 0.05}>
                    <div className="group">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                        <Image
                          src={m.image}
                          alt={m.name}
                          fill
                          sizes="(max-width:768px) 50vw, 250px"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.06]"
                        />
                      </div>
                      <div
                        className="mt-3 text-[16px] font-bold leading-tight"
                        style={{ color: solid(page.board.surface.tone, page.board.nameColor) }}
                      >
                        {m.name}
                      </div>
                      <div
                        className="mt-0.5 text-[13px] font-semibold"
                        style={{ color: muted(page.board.surface.tone, page.board.roleColor, 50) }}
                      >
                        {m.role}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Constellation — general members */}
        {generalMembers.length > 0 && (
          <Section
            surface={page.constellation.surface}
            defaultBackground="var(--color-mist)"
            className="py-24 max-md:py-16"
          >
            <div className="shell">
              <Headline
                data={page.constellation.headline}
                sizes={[42, 42, 32]}
                className="font-extrabold leading-[1.1]"
                defaultColor={solid(page.constellation.surface.tone)}
              />
              {page.constellation.body && (
                <p
                  className="mt-4 max-w-lg text-[17px] font-medium"
                  style={{ color: muted(page.constellation.surface.tone, page.constellation.bodyColor) }}
                >
                  {page.constellation.body}
                </p>
              )}
              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-10 max-md:gap-x-4">
                {generalMembers.map((m, i) => (
                  <Reveal key={m.name} delay={(i % 6) * 0.04} y={30}>
                    <div className="group flex w-32 flex-col items-center text-center max-md:w-24">
                      <div
                        className={`relative h-24 w-24 overflow-hidden rounded-full shadow-card transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 max-md:h-18 max-md:w-18 ${i % 3 === 1 ? "mt-6" : i % 3 === 2 ? "mt-2" : ""}`}
                      >
                        <Image src={m.image} alt={m.name} fill sizes="96px" className="object-cover" />
                      </div>
                      <span
                        className="mt-3 text-[13px] font-bold leading-tight"
                        style={{ color: muted(page.constellation.surface.tone, page.constellation.nameColor, 80) }}
                      >
                        {m.name}
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Voices */}
        {voices.length > 0 && (
          <Section surface={page.voices.surface} defaultBackground="var(--color-mist)" className="pb-24">
            <div className="shell">
              <Headline
                data={page.voices.headline}
                sizes={[42, 42, 32]}
                className="max-w-xl font-extrabold leading-[1.1]"
                defaultColor={solid(page.voices.surface.tone)}
              />
              <div className="mt-12 grid grid-cols-3 gap-8 max-lg:grid-cols-1">
                {voices.map((v, i) => (
                  <PostCard key={v.name} quote={v.quote} name={v.name} role={v.role} image={v.image} drift={[-40, 0, -18][i % 3]} />
                ))}
              </div>
            </div>
          </Section>
        )}

        {page.showCta && <CTABanner />}
      </main>
      <SiteFooter />
    </>
  );
}
