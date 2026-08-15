import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Headline from "@/components/Headline";
import Section, { muted } from "@/components/Section";
import ContactBlocks from "@/components/ContactBlocks";
import FormShell from "@/components/FormShell";
import Reveal from "@/components/Reveal";
import { cssColor } from "@/lib/theme";
import { getContactContent, getSiteSettings } from "@/lib/content";
import { submitContact } from "./actions";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactContent();
  return {
    ...(page.seo.title ? { title: page.seo.title } : {}),
    ...(page.seo.description ? { description: page.seo.description } : {}),
    ...(page.seo.image ? { openGraph: { images: [page.seo.image] } } : {}),
    ...(page.seo.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function ContactPage() {
  const [site, page] = await Promise.all([getSiteSettings(), getContactContent()]);

  return (
    <>
      <SiteHeader tone="light" />
      <main>
        <Section surface={page.hero.surface} className="pt-52 pb-20 max-md:pt-32">
          <div className="shell">
            <Headline
              data={page.hero.headline}
              as="h1"
              sizes={[140, 80, 56]}
              className="max-w-3xl font-extrabold leading-[1.06] tracking-tight"
              defaultColor="var(--color-ink)"
            />
            <ContactBlocks
              blocks={page.hero.blocks}
              site={site}
              titleColor={page.hero.blockTitleColor}
              linkColor={page.hero.blockLinkColor}
              className="mt-14"
            />
          </div>
        </Section>

        <Section
          id="say-hello"
          surface={page.form.surface}
          defaultBackground="var(--color-mist)"
          className="scroll-mt-28 py-20 max-md:py-12"
        >
          <div className="shell">
            <Reveal y={40}>
              <div
                className="mx-auto max-w-2xl rounded-2xl p-10 shadow-banner max-md:p-6"
                style={{ backgroundColor: cssColor(page.form.cardBackground, "var(--color-paper)") }}
              >
                {page.form.intro && (
                  <p
                    className="mb-6 text-[17px] font-medium leading-relaxed"
                    style={{ color: muted("light", page.form.introColor) }}
                  >
                    {page.form.intro}
                  </p>
                )}
                <FormShell submit={submitContact} fields={page.form.fields} chrome={page.form.chrome} />
              </div>
            </Reveal>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
