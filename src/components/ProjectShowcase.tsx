"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/types";
import { formatDate } from "@/lib/format";

const EASE = [0.22, 1, 0.36, 1] as const;
const PER_PAGE = 3;

/**
 * Projects on the home page, in the same card treatment as the blog carousel:
 * three at a time with the middle one inverted, and each card opening the post
 * that tells that project's story.
 *
 * Paging moves a whole row rather than one card — stepping by one leaves the
 * highlighted centre position hopping between projects on every press.
 */
export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  const [page, setPage] = useState(0);

  const pages = Math.max(1, Math.ceil(projects.length / PER_PAGE));
  const go = useCallback(
    (delta: number) => setPage((p) => (p + delta + pages) % pages),
    [pages],
  );

  if (projects.length === 0) return null;
  const visible = projects.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <div className="relative">
      <div className="grid gap-7 md:grid-cols-3">
        {visible.map((project, i) => {
          const featured = visible.length === PER_PAGE && i === 1;
          const href = project.postSlug ? `/blog/${project.postSlug}` : "/blog";

          return (
            <m.article
              key={`${project.title}-${i}`}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
              className={`rounded-lg border p-6 ${
                featured
                  ? "border-transparent bg-space text-paper md:-my-4"
                  : "border-line bg-paper"
              }`}
            >
              <Link href={href} className="group block">
                <div className="flex items-start justify-between gap-4">
                  <span aria-hidden className="text-cranberry">
                    ◕
                  </span>
                  <span className="text-[13px] font-medium text-cranberry">
                    {project.avenue}
                  </span>
                </div>

                <h3
                  className={`title-sans mt-4 text-[19px] leading-snug ${
                    featured ? "text-paper" : "text-ink"
                  }`}
                >
                  {project.title}
                </h3>
                <p className={`body-text mt-3 ${featured ? "text-paper/70" : "text-ink-soft"}`}>
                  {project.description}
                </p>

                {project.image && (
                  <div className="relative mt-5 aspect-[4/3] w-full overflow-hidden rounded-md bg-mist">
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                  </div>
                )}

                {project.date && (
                  <time
                    dateTime={project.date}
                    className={`mt-4 block text-[13px] font-medium ${
                      featured ? "text-paper/50" : "text-ink/45"
                    }`}
                  >
                    {formatDate(project.date)}
                  </time>
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
  );
}

function PageButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous projects" : "Next projects"}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-ink text-paper transition-transform hover:scale-105 max-lg:hidden ${
        side === "left" ? "-left-5" : "-right-5"
      }`}
    >
      <svg
        width="15"
        height="12"
        viewBox="0 0 17 12"
        fill="none"
        aria-hidden
        style={side === "left" ? { transform: "scaleX(-1)" } : undefined}
      >
        <path
          d="M11 1L16 6L11 11M16 6H1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
