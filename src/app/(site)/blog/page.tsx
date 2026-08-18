import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import PostGrid from "@/components/PostGrid";
import { getAvenues, getBlogs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, reflections and write-ups from the Rotaract Club of Coimbatore Main.",
};

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ avenue?: string }>;
}) {
  const [{ avenue: selected }, posts, avenues] = await Promise.all([
    searchParams,
    getBlogs(),
    getAvenues(),
  ]);

  // The avenue filter is a query param rather than a route so the deck on the
  // home page can deep-link straight into it.
  const filtered = selected ? posts.filter((p) => p.avenue?.slug === selected) : posts;
  const active = avenues.find((a) => a.slug === selected);

  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <section className="pt-52 pb-16 max-md:pt-32">
          <div className="shell">
            <p className="eyebrow text-ink/45">From the club</p>
            <h1
              className="headline mt-5 max-w-[16ch] text-ink"
              style={{ "--h-min": "40px", "--h-max": "78px" } as React.CSSProperties}
            >
              {active ? active.name : "Stories from the work."}
            </h1>
            {active && <p className="lede mt-5 max-w-[52ch] text-ink-soft">{active.description}</p>}

            {/* --- avenue filter ------------------------------------------- */}
            <nav className="mt-10 flex flex-wrap gap-2" aria-label="Filter posts by avenue">
              <FilterChip href="/blog" active={!selected}>
                All
              </FilterChip>
              {avenues.map((a) => (
                <FilterChip key={a.id} href={`/blog?avenue=${a.slug}`} active={selected === a.slug}>
                  {a.name}
                </FilterChip>
              ))}
            </nav>
          </div>
        </section>

        <section className="pb-24">
          <div className="shell">
            <PostGrid posts={filtered} />
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-line text-ink-soft hover:border-ink/40 hover:text-ink"
      }`}
    >
      {children}
    </Link>
  );
}
