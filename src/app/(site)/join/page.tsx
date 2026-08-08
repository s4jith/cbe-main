import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Headline from "@/components/Headline";
import Section, { muted } from "@/components/Section";
import ContactBlocks from "@/components/ContactBlocks";
import FormShell from "@/components/FormShell";
import Reveal from "@/components/Reveal";
import { cssColor } from "@/lib/theme";
import { getJoinContent, getSiteSettings } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getJoinContent();
  return {
    ...(page.seo.title ? { title: page.seo.title } : {}),
    ...(page.seo.description ? { description: page.seo.description } : {}),
    ...(page.seo.image ? { openGraph: { images: [page.seo.image] } } : {}),
    robots: page.seo.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function JoinPage() {
  const [site, page] = await Promise.all([getSiteSettings(), getJoinContent()]);

  return (
    <>
      <SiteHeader tone="light" />
      <main>
        <Section surface={page.hero.surface} className="pt-52 pb-16 max-md:pt-32">
          <div className="shell">
            <Headline
              data={page.hero.headline}
              as="h1"
              sizes={[140, 76, 52]}
              className="max-w-3xl font-extrabold leading-[1.06] tracking-tight"
              defaultColor="var(--color-ink)"
            />
            {page.hero.kicker && (
              <p
                className="mt-8 text-[20px] font-extrabold lowercase"
                style={{ color: muted(page.hero.surface.tone, page.hero.kickerColor, 70) }}
              >
                {page.hero.kicker}
              </p>
            )}
            {page.hero.body && (
              <p
                className="mt-2 max-w-xl text-[17px] font-medium leading-relaxed"
                style={{ color: muted(page.hero.surface.tone, page.hero.bodyColor) }}
              >
                {page.hero.body}
              </p>
            )}
          </div>
        </Section>

        <Section surface={page.form.surface} defaultBackground="var(--color-mist)" className="py-20 max-md:py-12">
          <div className="shell">
            <Reveal y={40}>
              <div
                className="mx-auto max-w-2xl rounded-2xl p-10 shadow-banner max-md:p-6"
                style={{ backgroundColor: cssColor(page.form.cardBackground, "var(--color-paper)") }}
              >
                <FormShell
                  action={site.forms.join}
                  fields={page.form.fields}
                  chrome={page.form.chrome}
                  consentLabel={page.form.consentLabel}
                />
              </div>
            </Reveal>
          </div>
        </Section>

        <Section surface={page.contact.surface} className="py-16">
          <div className="shell">
            <ContactBlocks
              blocks={page.contact.blocks}
              site={site}
              titleColor={page.contact.titleColor}
              linkColor={page.contact.linkColor}
            />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
