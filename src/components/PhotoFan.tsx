"use client";

import Image from "next/image";
import { m, useReducedMotion } from "framer-motion";

const rotations = [-8, 4, 8, -4, 6];

/** Overlapping rotated photo-card fan (about hero) with springy hover nudge. */
export default function PhotoFan({ images }: { images: { src: string; alt: string }[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="flex justify-center max-md:flex-wrap max-md:gap-4">
      {images.slice(0, 5).map((img, i) => (
        <m.div
          key={img.src}
          className="relative -mx-4 h-[420px] w-[298px] overflow-hidden rounded-3xl shadow-card max-md:mx-0 max-md:h-[220px] max-md:w-[46%]"
          style={{ rotate: rotations[i], zIndex: i === 2 ? 3 : 1 }}
          initial={reduced ? false : { y: 120, opacity: 0, rotate: 0 }}
          whileInView={{ y: 0, opacity: 1, rotate: rotations[i] }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1], delay: i * 0.1 }}
          whileHover={
            reduced
              ? undefined
              : { y: -14, rotate: rotations[i] * 1.6, transition: { type: "spring", stiffness: 260, damping: 14 } }
          }
        >
          <Image src={img.src} alt={img.alt} fill sizes="298px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        </m.div>
      ))}
    </div>
  );
}
