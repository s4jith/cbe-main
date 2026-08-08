import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fill, getFooter, getHeader, getSiteSettings, siteVars } from "@/lib/content";

/** Server wrappers so pages can drop in the header/footer with no props. */

export function SiteHeader({ tone = "light" }: { tone?: "light" | "dark" }) {
  return <Header data={getHeader()} tone={tone} />;
}

export function SiteFooter() {
  const footer = getFooter();
  const vars = siteVars(getSiteSettings());
  return (
    <Footer
      data={{
        ...footer,
        brandLine: fill(footer.brandLine, vars),
        copyright: fill(footer.copyright, vars),
        note: fill(footer.note, vars),
      }}
    />
  );
}
