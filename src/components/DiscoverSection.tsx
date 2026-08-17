"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export type DiscoverStat = {
  value: string;
  label: string;
  /** Optional destination — the last tile in the reference is a link. */
  href?: string;
};

/**
 * The club in one screen: a paragraph, four figures, and one photograph.
 *
 * The figures are set as a two-by-two block rather than a row so they read as a
 * a set of facts to take in, not a scoreboard to skim.
 */
export default function DiscoverSection({
  eyebrow,
  heading,
  body,
  stats,
  image,
  imageLabel,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  stats: DiscoverStat[];
  image: string;
  imageLabel: string;
}) {
  const reduced = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -80px 0px" },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <section className="section-y bg-space-deep text-paper">
      <div className="shell">
        <m.p {...rise(0)} className="eyebrow text-paper/40">
          {eyebrow}
        </m.p>
        <m.h2
          {...rise(0.06)}
          className="mt-4 font-sans font-extrabold uppercase leading-none tracking-[-0.02em] text-paper"
          style={{ fontSize: "clamp(30px, 4.4vw, 58px)" }}
        >
          {heading}
        </m.h2>

        <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-2 lg:items-start max-lg:mt-10">
          {/* --- words and figures ---------------------------------------- */}
          <div>
            <m.p {...rise(0.12)} className="body-text max-w-[54ch] text-paper/65">
              {body}
            </m.p>

            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 max-lg:mt-10">
              {stats.map((stat, i) => {
                const inner = (
                  <>
                    <p className="numeric font-sans text-[30px] font-bold leading-none text-paper max-md:text-[24px]">
                      {stat.value}
                    </p>
                    <p className="mt-2.5 text-[16px] text-paper/70 max-md:text-[14px]">
                      {stat.label}
                      {stat.href && <span aria-hidden> ↗</span>}
                    </p>
                    {/* The rule under each figure is the reference's one flash
                        of accent in this band — kept short so it underlines the
                        number rather than the whole column. */}
                    <span className="mt-4 block h-[3px] w-16 rounded-full bg-cranberry" />
                  </>
                );

                return (
                  <m.div key={stat.label} {...rise(0.18 + i * 0.07)}>
                    {stat.href ? (
                      <Link href={stat.href} className="group block">
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </m.div>
                );
              })}
            </div>
          </div>

          {/* --- photograph ------------------------------------------------ */}
          <m.figure
            {...rise(0.16)}
            className="overflow-hidden rounded-lg bg-paper max-lg:mx-auto max-lg:max-w-[520px]"
          >
            <div className="grain relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </div>
            <figcaption className="flex items-center gap-2.5 px-6 py-5">
              <span aria-hidden className="text-cranberry">
                ▸
              </span>
              <span className="title-sans text-[18px] text-cranberry max-md:text-[16px]">
                {imageLabel}
              </span>
            </figcaption>
          </m.figure>
        </div>
      </div>
    </section>
  );
}
