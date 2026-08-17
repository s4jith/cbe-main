"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import type { BlogSummary } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;
const PER_PAGE = 3;

/**
 * The blog on the home page: three posts at a time, the middle one inverted so
 * the row has a centre of gravity rather than reading as three equal boxes.
 *
 * Paging moves whole screens rather than single cards — with three visible, a
 * one-card step leaves the highlighted middle position jumping between posts on
 * every press, which is more distracting than it is useful.
 */
export default function BlogsCarousel({
  posts,
  heading,
  kicker,
}: {
  posts: BlogSummary[];
  heading: string;
  kicker: string;
}) {
  const reduced = useReducedMotion();
  const [page, setPage] = useState(0);

  const pages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const go = useCallback(
    (delta: number) => setPage((p) => (p + delta + pages) % pages),
    [pages],
  );

  if (posts.length === 0) return null;
  const visible = posts.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="section-y bg-paper">
      <div className="shell">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-sans text-[clamp(26px,3vw,42px)] font-extrabold text-ink">
            {kicker}{" "}
            <span className="rounded-md bg-cranberry px-3 py-0.5 text-paper">{heading}</span>
          </h2>
          <Link
            href="/blog"
            className="wipe-link inline-flex items-center gap-2 text-[15px] font-semibold text-ink"
          >
            All posts <span aria-hidden>↗</span>
          </Link>
        </div>

        <p className="mt-8 border-l-4 border-cranberry pl-5 font-sans text-[clamp(20px,2.4vw,34px)] font-bold text-ink">
          Stories from the work
        </p>

        <div className="relative mt-12 max-md:mt-8">
          <div className="grid gap-7 md:grid-cols-3">
            {visible.map((post, i) => {
              // The middle card of a full row carries the inverted treatment.
              const featured = visible.length === PER_PAGE && i === 1;
              return (
                <m.article
                  key={post.id}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
                  className={`rounded-lg border p-6 ${
                    featured
                      ? "border-transparent bg-space text-paper md:-my-4"
                      : "border-line bg-paper"
                  }`}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="flex items-start justify-between gap-4">
                      <span aria-hidden className="text-cranberry">
                        ◕
                      </span>
                      <span className="text-[13px] font-medium text-cranberry">
                        {readingTime(post.summary)} min read
                      </span>
                    </div>

                    <h3
                      className={`title-sans mt-4 text-[19px] leading-snug ${
                        featured ? "text-paper" : "text-ink"
                      }`}
                    >
                      {post.name}
                    </h3>
                    <p
                      className={`body-text mt-3 ${featured ? "text-paper/70" : "text-ink-soft"}`}
                    >
                      {post.summary}
                    </p>

                    {post.image.src && (
                      <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-md bg-mist">
                        <Image
                          src={post.image.src}
                          alt={post.image.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                        />
                      </div>
                    )}
                  </Link>
                </m.article>
              );
            })}
          </div>

          {pages > 1 && (
            <>
              <PageButton side="left" onClick={() => go(-1)} />
              <PageButton side="right" onClick={() => go(1)} />
              <div className="mt-10 flex items-center justify-center gap-2.5">
                {Array.from({ length: pages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Go to page ${i + 1}`}
                    aria-current={i === page}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === page ? "w-6 bg-cranberry" : "w-2.5 bg-ink/20 hover:bg-ink/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function PageButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous posts" : "Next posts"}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink text-paper transition-transform hover:scale-105 max-lg:hidden ${
        side === "left" ? "-left-5" : "-right-5"
      }`}
    >
      <svg width="15" height="12" viewBox="0 0 17 12" fill="none" aria-hidden
        style={side === "left" ? { transform: "scaleX(-1)" } : undefined}>
        <path d="M11 1L16 6L11 11M16 6H1" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** Rough reading time from the summary — enough for a card label. */
function readingTime(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).length / 40));
}
