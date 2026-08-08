import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Headline from "@/components/Headline";
import ProjectsGrid from "@/components/ProjectsGrid";
import CTABanner from "@/components/CTABanner";
import { clubYearOf } from "@/lib/dates";
import {
  fill,
  getHomeContent,
  getProjects,
  getProjectsContent,
  getSiteSettings,
  siteVars,
} from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = getProjectsContent();
  return {
    ...(page.seo.title ? { title: page.seo.title } : {}),
    ...(page.seo.description ? { description: page.seo.description } : {}),
    ...(page.seo.image ? { openGraph: { images: [page.seo.image] } } : {}),
    ...(page.seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

// No searchParams: the ?avenue= filter is applied inside ProjectsGrid on the
// client, which keeps this route statically prerendered under the layout's ISR
// window instead of hitting MongoDB on every request.
export default async function ProjectsPage() {
  const site = getSiteSettings();
  const home = getHomeContent();
  const page = getProjectsContent();
  const projects = await getProjects();

  const currentYear = clubYearOf(new Date().toISOString()).key;
  const countThisYear = projects.filter((p) => p.date && clubYearOf(p.date).key === currentYear).length;
  const vars = siteVars(site, { count: countThisYear });

  return (
    <>
      <SiteHeader tone="light" />
      <main>
        <section className="pb-14 pt-32 lg:pt-40">
          <div className="shell">
            <p className="eyebrow text-ink/45">{fill(page.hero.eyebrow, vars)}</p>
            <Headline
              data={page.hero.headline}
              as="h1"
              sizes={[70, 52, 34]}
              className="mt-4 max-w-[20ch] text-ink"
            />
          </div>
        </section>

        <section className="pb-28">
          <div className="shell">
            <ProjectsGrid
              projects={projects}
              avenues={home.avenues}
              allLabel={page.grid.allLabel}
              emptyMessage={page.grid.emptyMessage}
            />
          </div>
        </section>

        {page.showCta && <CTABanner />}
      </main>
      <SiteFooter />
    </>
  );
}
