"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/** Testimonial "social-post" card with browser-tab chrome; columns parallax-drift at different speeds. */
export default function PostCard({
  quote,
  name,
  role,
  image,
  drift = 0,
}: {
  quote: string;
  name: string;
  role: string;
  image: string;
  drift?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, drift]);

  return (
    <motion.div ref={ref} style={reduced ? undefined : { y }} className="relative will-change-transform">
      <div className="flex h-[50px] items-center gap-3 rounded-t-2xl bg-white px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-sm">✦</span>
        <span className="text-[14px] font-bold text-ink">gaalaxy voices</span>
      </div>
      <div className="bg-[#FAFAFA] p-6">
        <span className="text-3xl font-extrabold text-starlight leading-none">&ldquo;</span>
        <p className="mt-2 text-[17px] font-bold leading-relaxed text-ink">{quote}</p>
        <div className="mt-10 flex items-center gap-3">
          <Image src={image} alt={name} width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
          <div>
            <div className="text-[15px] font-bold text-ink">{name}</div>
            <div className="text-[15px] text-ink/70">{role}</div>
          </div>
        </div>
      </div>
      <div className="flex h-[38px] items-center justify-between rounded-b-2xl bg-white px-5 text-ink/30">
        <span aria-hidden>♥</span>
        <span aria-hidden>⚑</span>
      </div>
    </motion.div>
  );
}
