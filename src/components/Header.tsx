"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useMotionValueEvent, useScroll, useReducedMotion } from "framer-motion";
import type { HeaderData } from "@/lib/types";
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

          <nav aria-label="Primary" className="mx-auto max-lg:hidden">
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

          <div className="ml-auto shrink-0 max-lg:hidden">
            {!data.cta.hidden && data.cta.label && (
              <Link
                href={data.cta.href}
                className="jelly h-10 items-center rounded-full bg-starlight px-5 text-[13px] font-semibold tracking-[-0.01em] text-starlight-ink"
              >
                {data.cta.label}
              </Link>
            )}
          </div>

          <button
            ref={toggleRef}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Open menu"
            className={`ml-auto flex h-10 w-10 shrink-0 items-center justify-center transition-colors duration-300 lg:hidden ${
              onLight ? "text-ink" : "text-paper"
            }`}
          >
            <span className="sr-only">{data.menuLabel}</span>
            <span aria-hidden className="flex w-5 flex-col gap-[5px]">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
            </span>
          </button>
        </m.div>
      </m.div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-50 bg-space lg:hidden"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex h-dvh flex-col">
              <div className="shell flex items-center justify-between py-[22px]">
                <span className="text-[15px] font-semibold text-paper">
                  {data.wordmark}
                  <span className="text-starlight">{data.wordmarkSymbol}</span>
                </span>
                <button
                  ref={closeRef}
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center text-paper"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                    <path
                      d="M1 1l16 16M17 1L1 17"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <nav aria-label="Primary" className="shell flex flex-1 flex-col justify-center">
                <ul className="flex flex-col gap-1">
                  {data.items.map((item, i) => (
                    <m.li
                      key={item.href}
                      initial={reduced ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.18 + i * 0.055 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active === item.href ? "page" : undefined}
                        className="headline block py-2 text-paper"
                        style={{ "--h-min": "34px", "--h-max": "44px" } as React.CSSProperties}
                      >
                        <span className={active === item.href ? "text-starlight" : undefined}>
                          {item.label}
                        </span>
                      </Link>
                    </m.li>
                  ))}
                </ul>
              </nav>

              {!data.cta.hidden && data.cta.label && (
                <m.div
                  className="shell pb-[max(28px,env(safe-area-inset-bottom))]"
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.18 + data.items.length * 0.055 }}
                >
                  <Link
                    href={data.cta.href}
                    onClick={() => setOpen(false)}
                    className="flex h-14 w-full items-center justify-center rounded-full bg-starlight text-[15px] font-semibold text-starlight-ink"
                  >
                    {data.cta.label}
                  </Link>
                </m.div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
