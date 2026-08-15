import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fill, getFooter, getHeader, getSiteSettings, siteVars } from "@/lib/content";

/** Server wrappers so pages can drop in the header/footer with no props. */

export function SiteHeader({ tone = "light" }: { tone?: "light" | "dark" }) {
  return <Header data={getHeader()} tone={tone} />;
}

export async function SiteFooter() {
  const [footer, site] = await Promise.all([getFooter(), getSiteSettings()]);
  const vars = siteVars(site);

  return (
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
  );
}
