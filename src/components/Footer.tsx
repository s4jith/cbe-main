"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { nav } from "@/lib/nav";
import type { SiteInfo } from "@/lib/types";

function Wordmark() {
  const ref = useRef<SVGSVGElement>(null);
  const mx = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const cx = useTransform(sx, (v) => `${v * 100}%`);

  return (
    <div
      className="select-none"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (r) mx.set((e.clientX - r.left) / r.width);
      }}
    >
      <svg ref={ref} viewBox="0 0 1224 240" className="w-full" aria-hidden>
        <defs>
          <radialGradient id="fw-spot" r="0.28" cx="0" cy="0.5">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fw-mask">
            <text x="50%" y="78%" textAnchor="middle" fontFamily="var(--font-jakarta)" fontWeight="800" fontSize="228" fill="white" letterSpacing="-6">
              gaalaxy
            </text>
          </mask>
        </defs>
        <g mask="url(#fw-mask)">
          <rect width="1224" height="240" fill="white" fillOpacity="0.06" />
          <motion.circle r="340" cy="120" fill="url(#fw-spot)" style={{ cx }} />
        </g>
      </svg>
    </div>
  );
}

export default function Footer({ site }: { site: SiteInfo }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-45%", "0%"]);

  const columns = [
    { title: "pages", links: nav.map((n) => ({ label: n.label, href: n.href })) },
    {
      title: "get involved",
      links: [
        { label: "Become a Member", href: "/join" },
        { label: "Blood Donor Registry", href: "/blood-donor" },
        { label: "Say Hello", href: "/contact" },
      ],
    },
    { title: "socials", links: site.socials.map((s) => ({ label: s.label, href: s.href })) },
  ];

  return (
    <footer ref={wrapRef} className="relative overflow-hidden bg-space starfield">
      <div className="relative z-10 bg-space pb-24 pt-12">
        <div className="shell flex flex-wrap justify-between gap-12">
          <div className="max-w-72">
            <div className="text-2xl font-extrabold text-white">
              gaalaxy<span className="text-starlight">✦</span>
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-white/40">
              {site.parent} · Club ID {site.clubId} · {site.group} · {site.district}
            </p>
          </div>
          <div className="flex flex-wrap gap-16 max-md:gap-10">
            {columns.map((col) => (
              <div key={col.title}>
                <div className="text-[17px] font-medium lowercase text-white/30">{col.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="wipe-link text-[17px] font-medium text-white/80" {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <div className="text-[17px] font-medium lowercase text-white/30">get in touch</div>
              <ul className="mt-4 space-y-2.5">
                <li><a href={site.emailHref} className="wipe-link text-[17px] font-medium text-white/80">{site.email}</a></li>
                <li><a href={site.phoneHref} className="wipe-link text-[17px] font-medium text-white/80">{site.phone}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <motion.div style={{ y }} className="bg-gradient-to-b from-space-deep to-space px-9 pt-10">
        <Wordmark />
        <div className="shell mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-8">
          <p className="text-[15px] text-white/30">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="text-[15px] text-white/30">{site.tagline.split(".")[0]}.</p>
        </div>
      </motion.div>
    </footer>
  );
}
