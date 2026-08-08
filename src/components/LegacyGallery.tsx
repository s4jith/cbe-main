"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import type { LegacyPhoto } from "@/lib/types";

const EASE = [0.22, 0.61, 0.36, 1] as const;

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
    <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ChevronIcon = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden
    className={flip ? "rotate-180" : undefined}
  >
    <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * CSS-columns masonry with a shared-element lightbox: the tapped thumbnail is the
 * same `layoutId` as the enlarged photo, so Framer Motion morphs one into the
 * other instead of cross-fading — the "animative transition" this page exists to
 * show off. Reduced-motion visitors get a plain fade in its place.
 */
export default function LegacyGallery({ photos }: { photos: LegacyPhoto[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [active, photos.length]);

  const current = active === null ? null : photos[active];

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
        {photos.map((p, i) => (
          <m.button
            key={p.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
            className="mb-4 block w-full break-inside-avoid text-left"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.6, ease: EASE, delay: (i % 8) * 0.045 }}
          >
            <m.div layoutId={reduced ? undefined : `legacy-${i}`} className="grain group relative overflow-hidden bg-mist">
              <Image
                src={p.src}
                width={p.width}
                height={p.height}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                loading={i < 8 ? "eager" : "lazy"}
                alt=""
                className="h-auto w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
              />
            </m.div>
          </m.button>
        ))}
      </div>

      <AnimatePresence>
        {current && active !== null && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-space/94 p-4 backdrop-blur-sm sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={() => setActive(null)}
          >
            <m.div
              layoutId={reduced ? undefined : `legacy-${active}`}
              className="relative max-h-[82vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.src}
                width={current.width}
                height={current.height}
                sizes="90vw"
                priority
                alt=""
                className="max-h-[82vh] w-auto max-w-[90vw] object-contain"
              />
            </m.div>

            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-paper/70 transition-colors hover:text-paper sm:right-6 sm:top-6"
            >
              <CloseIcon />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
              }}
              aria-label="Previous photo"
              className="absolute left-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-paper/70 transition-colors hover:text-paper sm:left-4"
            >
              <ChevronIcon flip />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActive((i) => (i === null ? i : (i + 1) % photos.length));
              }}
              aria-label="Next photo"
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-paper/70 transition-colors hover:text-paper sm:right-4"
            >
              <ChevronIcon />
            </button>

            <p className="numeric absolute bottom-4 left-1/2 -translate-x-1/2 text-[12px] text-paper/45 sm:bottom-6">
              {active + 1} / {photos.length}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
