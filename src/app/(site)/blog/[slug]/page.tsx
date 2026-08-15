import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Prose from "@/components/Prose";
import Reveal from "@/components/Reveal";
import CTABanner from "@/components/CTABanner";
import { getBlogBySlug, getBlogs } from "@/lib/content";
import { formatDate } from "@/lib/format";

export async function generateStaticParams() {
  const posts = await getBlogs();
  return posts.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};
  return {
    title: post.name,
    description: post.summary,
    openGraph: { images: post.image.src ? [post.image.src] : [] },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <article>
          {/* --- title block ---------------------------------------------- */}
          <header className="pt-52 pb-12 max-md:pt-32">
            <div className="shell">
              <Link
                href={post.avenue ? `/blog?avenue=${post.avenue.slug}` : "/blog"}
                className="wipe-link text-[13px] font-semibold uppercase tracking-[0.14em] text-starlight-deep"
              >
                {post.avenue?.name ?? "Blog"}
              </Link>
              <h1
                className="headline mt-5 max-w-[20ch] text-ink"
                style={{ "--h-min": "34px", "--h-max": "68px" } as React.CSSProperties}
              >
                {post.name}
              </h1>
              <p className="lede mt-6 max-w-[56ch] text-ink-soft">{post.summary}</p>
              {post.date && (
                <time dateTime={post.date} className="mt-6 block text-[14px] font-medium text-ink/45">
                  {formatDate(post.date)}
                </time>
              )}
            </div>
          </header>

          {/* --- hero image ----------------------------------------------- */}
          {post.image.src && (
            <div className="shell">
              <Reveal y={40}>
                <div className="grain relative aspect-[16/9] overflow-hidden rounded-md bg-mist max-md:aspect-[4/3]">
                  <Image
                    src={post.image.src}
                    alt={post.image.alt}
                    fill
                    priority
                    sizes="(max-width: 1320px) 100vw, 1320px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          )}

          {/* --- body ------------------------------------------------------ */}
          <div className="shell py-16 max-md:py-12">
            <div className="mx-auto max-w-[68ch]">
              <Prose data={post.details} />
            </div>
          </div>

          {/* --- gallery ---------------------------------------------------- */}
          {post.gallery.length > 0 && (
            <div className="shell pb-20">
              <div className="grid gap-5 md:grid-cols-3">
                {post.gallery.map((picture, i) => (
                  <Reveal key={i} delay={i * 0.08} y={30}>
                    <div className="grain relative aspect-[3/4] overflow-hidden rounded-md bg-mist">
                      <Image
                        src={picture.src}
                        alt={picture.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          <div className="shell pb-20">
            <Link href="/blog" className="wipe-link text-[15px] font-semibold text-ink">
              ← All posts
            </Link>
          </div>
        </article>

        <CTABanner />
      </main>
      <SiteFooter />
    </>
  );
}
