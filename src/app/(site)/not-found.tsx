import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Headline from "@/components/Headline";
import Section, { muted } from "@/components/Section";
import { CmsButton } from "@/components/Buttons";
import { getNotFoundContent } from "@/lib/content";

export default async function NotFound() {
  const page = await getNotFoundContent();

  return (
    <>
      <SiteHeader tone="light" />
      <main>
        <Section
          surface={page.surface}
          className="flex min-h-[80vh] flex-col items-center justify-center pt-32 text-center"
        >
          <p
            className="text-[120px] font-extrabold leading-none max-md:text-[80px]"
            style={{ color: muted(page.surface.tone, page.codeColor, 10) }}
          >
            {page.code}
          </p>
          <Headline
            data={page.headline}
            as="h1"
            sizes={[42, 42, 28]}
            className="mt-4 font-extrabold"
            defaultColor="var(--color-ink)"
          />
          <p
            className="mt-3 max-w-md text-[17px] font-medium"
            style={{ color: muted(page.surface.tone, page.bodyColor) }}
          >
            {page.body}
          </p>
          <div className="mt-8 pb-24">
            <CmsButton data={page.cta} />
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
