"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { formatDate } from "@/lib/format";
import type { Accent, BlogSummary } from "@/lib/types";

const ACCENT: Record<Accent, string> = {
  starlight: "var(--color-starlight)",
  cranberry: "var(--color-cranberry)",
  comet: "var(--color-comet)",
  nebula: "var(--color-nebula)",
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The blog index. Each card shows only the hero image and the summary — the rest
 * of the post is behind the click, which is the whole point of `cardSummary`
 * being its own field rather than an excerpt of the body.
 */
export default function PostGrid({ posts }: { posts: BlogSummary[] }) {
  const reduced = useReducedMotion();

  if (posts.length === 0) {
    return <p className="body-text text-ink-soft">No posts here yet — check back soon.</p>;
  }

  return (
    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <m.article
          key={post.id}
          initial={reduced ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.08 }}
        >
          <Link href={`/blog/${post.slug}`} className="group block">
            <div className="grain relative aspect-[4/3] overflow-hidden rounded-md bg-mist">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            </div>

            <div className="mt-5">
              {post.avenue && (
                <span className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ink/55">
                  <span
                    className="inline-block h-[7px] w-[7px] rounded-full"
                    style={{ background: ACCENT[post.avenue.accent] ?? ACCENT.starlight }}
                  />
                  {post.avenue.name}
                </span>
              )}
              <h2 className="title-sans mt-3 text-[21px] leading-snug text-ink">{post.name}</h2>
              <p className="body-text mt-2 text-ink-soft">{post.summary}</p>
              {post.date && (
                <time
                  dateTime={post.date}
                  className="mt-3 block text-[13px] font-medium text-ink/45"
                >
                  {formatDate(post.date)}
                </time>
              )}
            </div>
          </Link>
        </m.article>
      ))}
    </div>
  );
}
