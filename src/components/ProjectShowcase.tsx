"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/types";
import { formatDate } from "@/lib/format";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Seven projects on the home page, each opening the post that tells its story.
 *
 * The first card runs double width so the row does not read as a plain grid —
 * with seven items an even grid always leaves an awkward gap on the last line.
 */
export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const reduced = useReducedMotion();
  if (projects.length === 0) return null;

  return (
    <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => {
        const wide = i === 0;
        return (
          <m.article
            key={`${project.title}-${i}`}
            className={wide ? "md:col-span-2" : undefined}
            initial={reduced ? false : { opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.07 }}
          >
            <Link
              href={project.postSlug ? `/blog/${project.postSlug}` : "/blog"}
              className="group block"
            >
              <div
                className={`grain relative overflow-hidden rounded-md bg-mist ${
                  wide ? "aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                {project.image && (
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes={wide ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                )}
              </div>

              <div className="mt-5">
                <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink/50">
                  {project.avenue}
                </span>
                <h3
                  className={`title-sans mt-2.5 leading-snug text-ink ${
                    wide ? "text-[26px] max-md:text-[21px]" : "text-[20px]"
                  }`}
                >
                  {project.title}
                </h3>
                <p className="body-text mt-2 max-w-[52ch] text-ink-soft">{project.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  {project.date && (
                    <time dateTime={project.date} className="text-[13px] font-medium text-ink/45">
                      {formatDate(project.date)}
                    </time>
                  )}
                  <span className="wipe-link text-[13px] font-semibold text-starlight-deep">
                    {project.postSlug ? "Read the story" : "More on the blog"}
                  </span>
                </div>
              </div>
            </Link>
          </m.article>
        );
      })}
    </div>
  );
}
