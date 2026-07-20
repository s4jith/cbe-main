import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplitHeadline from "@/components/SplitHeadline";
import ProjectsGrid from "@/components/ProjectsGrid";
import CTABanner from "@/components/CTABanner";
import { getHomeContent, getProjects, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "500+ projects across five avenues of service — community impact, professional growth, international friendship, and district priorities.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ avenue?: string }>;
}) {
  const { avenue } = await searchParams;
  const [site, projects, home] = await Promise.all([
    getSiteSettings(),
    getProjects(),
    getHomeContent(),
  ]);
  return (
    <>
      <Header tone="light" />
      <main>
        <section className="pt-48 pb-14 max-md:pt-32">
          <div className="shell">
            <p className="text-[17px] font-medium lowercase text-ink/40">
              {projects.length} projects this year · 500+ all-time
            </p>
            <SplitHeadline
              as="h1"
              lines={[
                "500+ projects.",
                <span key="l2">
                  Zero applause <span className="text-starlight">✦</span> needed.
                </span>,
              ]}
              className="mt-3 text-[82px] font-extrabold leading-[1.08] tracking-tight text-ink max-lg:text-[56px] max-md:text-[38px]"
            />
          </div>
        </section>

        <section className="pb-28">
          <div className="shell">
            <ProjectsGrid projects={projects} avenues={home.avenues} initialAvenue={avenue} />
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer site={site} />
    </>
  );
}
