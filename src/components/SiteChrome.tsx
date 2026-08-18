import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CtaClose from "@/components/CtaClose";
import { fill, getFooter, getHeader, getShared, getSiteSettings, siteVars } from "@/lib/content";

/** Server wrappers so pages can drop in the header/footer with no props. */

export async function SiteHeader({
  tone = "light",
  pinned = true,
}: {
  tone?: "light" | "dark";
  pinned?: boolean;
}) {
  return <Header data={await getHeader()} tone={tone} pinned={pinned} />;
}

export async function SiteFooter() {
  const [footer, site] = await Promise.all([getFooter(), getSiteSettings()]);
  const vars = siteVars(site);

  const { cta } = getShared();

  return (
    <>
      <CtaClose
        cta={{
          headline: cta.headline.lines,
          body: cta.body,
          primary: { label: cta.primary.label, href: cta.primary.href },
          secondary: { label: cta.secondary.label, href: cta.secondary.href },
          secondaryNote: "No membership needed — register once, help when it matters.",
        }}
        symbol={cta.symbol}
      />
      <Footer
        data={{
          ...footer,
          brandLine: fill(footer.brandLine, vars),
          copyright: fill(footer.copyright, vars),
          note: fill(footer.note, vars),
        }}
        site={site}
        menu={footer.menu}
      />
    </>
  );
}
