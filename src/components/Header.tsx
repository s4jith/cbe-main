"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import type { HeaderData } from "@/lib/types";
import SocialIcon from "@/components/SocialIcon";
import { smoothScroll } from "@/components/LenisProvider";

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function Header({
  data,
  tone = "light",
}: {
  data: HeaderData;
  tone?: "light" | "dark";
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const active = pathname === "/" ? "/" : `/${pathname.split("/")[1]}`;

  // Threshold crossing rather than a per-pixel listener: this re-renders twice per
  // page, not on every frame of every scroll.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 24;
    setCondensed((prev) => (prev === next ? prev : next));
  });

  // Publish the bar's real height so anything that needs to sit just below a
  // fixed header — a sticky filter bar, an in-page anchor's scroll-margin —
  // can read `var(--header-h)` instead of a guessed pixel value that drifts
  // every time the condense animation's padding changes.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Once the bar has its own paper background, its contents are always on light —
  // regardless of how dark the hero underneath happens to be.
  const onLight = condensed || tone === "light";

  // Hold the page still behind the overlay, and hand focus to the close button so
  // keyboard users land inside the menu they just opened.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    smoothScroll.stop();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
      smoothScroll.start();
      window.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <header ref={barRef} className="fixed inset-x-0 top-0 z-50">
      <m.div
        className="relative"
        animate={{
          backgroundColor: condensed ? "rgba(247,244,238,0.82)" : "rgba(247,244,238,0)",
        }}
        transition={{ duration: 0.4, ease: EASE }}
        style={{
          backdropFilter: condensed ? "blur(12px)" : "none",
          WebkitBackdropFilter: condensed ? "blur(12px)" : "none",
          borderBottom: `1px solid ${condensed ? "var(--color-line)" : "transparent"}`,
          transition: "border-color 400ms, backdrop-filter 400ms",
        }}
      >
        <m.div
          className="shell flex items-center gap-8"
          animate={{ paddingTop: condensed ? 12 : 22, paddingBottom: condensed ? 12 : 22 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${data.logoAlt} — home`}
          >
            {data.logo && (
              <m.div
                animate={{ width: condensed ? 30 : 36, height: condensed ? 30 : 36 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative"
              >
                <Image
                  src={data.logo}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-contain"
                  priority
                />
              </m.div>
            )}
            {data.wordmark && (
              <span
                className={`text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${
                  onLight ? "text-ink" : "text-paper"
                }`}
              >
                {data.wordmark}
                <span className="text-starlight">{data.wordmarkSymbol}</span>
              </span>
            )}
          </Link>

          {/* Hidden from the bar so the overlay is the single way into the site,
              the way the reference does it. The links still render inside the
              menu, so nothing is lost to crawlers. */}
          <nav aria-label="Primary" className="mx-auto hidden">
            <ul className="flex items-center gap-1">
              {data.items.map((item) => {
                const isActive = active === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative block px-3.5 py-2 text-[14px] font-medium transition-colors duration-300 ${
                        onLight
                          ? isActive
                            ? "text-ink"
                            : "text-ink-soft hover:text-ink"
                          : isActive
                            ? "text-paper"
                            : "text-paper/65 hover:text-paper"
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <m.span
                          layoutId="nav-underline"
                          className="absolute inset-x-3.5 -bottom-0.5 h-px bg-starlight"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto shrink-0 max-md:hidden">
            {!data.cta.hidden && data.cta.label && (
              <Link
                href={data.cta.href}
                className="jelly h-10 items-center rounded-full bg-starlight px-5 text-[13px] font-semibold tracking-[-0.01em] text-starlight-ink"
              >
                {data.cta.label}
              </Link>
            )}
          </div>

          {/* Available at every width, not just on a phone — the overlay is the
              signature transition and hiding it from desktop wasted it. */}
          <button
            ref={toggleRef}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className={`group flex shrink-0 items-center gap-3 transition-colors duration-300 max-md:ml-auto md:ml-6 ${
              onLight ? "text-ink" : "text-paper"
            }`}
          >
            <span className="text-[15px] font-semibold max-md:sr-only">{data.menuLabel}</span>
            <span
              aria-hidden
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
                onLight ? "bg-ink text-paper" : "bg-paper text-ink"
              }`}
            >
              <span className="flex w-[15px] flex-col gap-[4px]">
                <span className="h-[1.5px] w-full bg-current" />
                <span className="h-[1.5px] w-full bg-current" />
                <span className="h-[1.5px] w-full bg-current" />
              </span>
            </span>
          </button>
        </m.div>
      </m.div>

      {/* The panel rises into place and leaves the same way. `y` on a fixed
          full-height sheet composites on the GPU, where animating clip-path made
          the whole overlay repaint every frame. */}
      <AnimatePresence>
        {open && (
          <m.div
            id="site-menu"
            className="fixed inset-0 z-50 bg-space"
            initial={reduced ? { opacity: 0 } : { y: "100%" }}
            animate={reduced ? { opacity: 1 } : { y: "0%" }}
            exit={
              reduced
                ? { opacity: 0 }
                : { y: "100%", transition: { duration: 0.5, ease: [0.7, 0, 0.84, 0] } }
            }
            transition={
              reduced
                ? { duration: 0.2 }
                : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
            }
          >
            {/* Two ribbons drifting down the middle — the only decoration in
                here, and pointer-inert so they never eat a click. */}
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 h-full w-[420px] -translate-x-1/2 max-lg:hidden"
              viewBox="0 0 420 900"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M150 0C260 180 60 330 170 500S250 760 190 900"
                stroke="var(--color-line-invert)"
                strokeWidth="1.5"
              />
              <path
                d="M240 0C350 200 130 360 250 540S320 780 260 900"
                stroke="var(--color-line-invert)"
                strokeWidth="1.5"
              />
            </svg>

            <div className="relative flex h-dvh flex-col">
              <div className="shell flex items-center justify-between py-[22px]">
                <span className="text-[15px] font-semibold text-paper">
                  {data.wordmark}
                  <span className="text-starlight">{data.wordmarkSymbol}</span>
                </span>
                <button
                  ref={closeRef}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-3 text-paper"
                >
                  <span className="text-[15px] font-semibold">Close</span>
                  <span
                    aria-hidden
                    className="grid h-10 w-10 place-items-center rounded-full bg-paper text-ink transition-transform duration-300 group-hover:rotate-90"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M1 1l12 12M13 1L1 13"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="shell grid flex-1 items-center gap-12 lg:grid-cols-2">
                {/* --- what's on ------------------------------------------- */}
                <m.div
                  className="max-lg:hidden"
                  initial={reduced ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                >
                  <h2 className="title-sans text-[26px] text-paper">
                    Get involved <span className="text-starlight">✦</span>
                  </h2>
                  <div className="mt-6 max-w-[420px] rounded-lg border border-line-invert p-7">
                    <p className="body-text text-paper/60">
                      Membership is open to anyone between 18 and 30 who wants to serve, lead
                      and grow with us — no prior experience needed.
                    </p>
                    <Link
                      href="/join"
                      onClick={() => setOpen(false)}
                      className="wipe-link mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-starlight"
                    >
                      Become a member
                      <span aria-hidden>↗</span>
                    </Link>
                  </div>
                </m.div>

                {/* --- the links ------------------------------------------- */}
                <nav aria-label="Primary" className="lg:justify-self-end">
                  <ul className="flex flex-col gap-1 lg:items-end">
                    {data.items.map((item, i) => (
                      <m.li
                        key={item.href}
                        initial={reduced ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.24 + i * 0.055 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          aria-current={active === item.href ? "page" : undefined}
                          className="block py-1.5 font-display text-paper transition-colors duration-300 hover:text-starlight"
                          style={{ fontSize: "clamp(30px, 3.6vw, 50px)", letterSpacing: "0.02em" }}
                        >
                          <span className={active === item.href ? "text-starlight" : undefined}>
                            {item.label}
                          </span>
                        </Link>
                      </m.li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* --- socials -------------------------------------------------- */}
              <m.div
                className="shell pb-[max(28px,env(safe-area-inset-bottom))]"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.24 + data.items.length * 0.055 }}
              >
                <div className="h-px w-full bg-cranberry/70" />
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
                  <p className="text-[15px] font-semibold text-paper/70">
                    Connect with us on our social media.
                  </p>
                  <ul className="flex items-center gap-6">
                    {data.socials
                      .filter((s) => s.href && s.href !== "#")
                      .map((s) => (
                        <li key={s.label}>
                          <Link
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={s.label}
                            className="block text-paper/70 transition-colors hover:text-starlight"
                          >
                            <SocialIcon name={s.label} size={22} />
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
