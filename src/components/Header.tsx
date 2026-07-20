"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/lib/nav";
import { PillButton } from "@/components/Buttons";

export default function Header({ tone = "light" }: { tone?: "light" | "dark" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const linkColor = tone === "light" ? "text-ink/80" : "text-white/80";
  const active = pathname === "/" ? "/" : `/${pathname.split("/")[1]}`;
  const pillTarget = hovered ?? active;

  return (
    <header className="absolute inset-x-0 top-0 z-30 pt-8 max-lg:pt-4">
      <div className="shell flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/brand/club-logo.webp" alt="Rotaract Club of Coimbatore Gaalaxy" width={44} height={44} className="h-11 w-11 object-contain" />
          <span className={`text-[17px] font-extrabold leading-tight ${tone === "light" ? "text-ink" : "text-white"}`}>
            gaalaxy<span className="text-starlight">✦</span>
          </span>
        </Link>

        <nav className="ml-6 max-lg:hidden" onMouseLeave={() => setHovered(null)}>
          <ul className="flex">
            {nav.map((item) => (
              <li key={item.href} className="border-l border-black/[0.07] px-1 first:border-0">
                <Link
                  href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  className={`relative flex h-[42px] items-center rounded-[9px] px-4 text-[17px] font-semibold ${linkColor}`}
                >
                  {pillTarget === item.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-[9px] ${tone === "light" ? "bg-[#60606014]" : "bg-white/10"}`}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto max-lg:hidden">
          <PillButton href="/join">Join Us</PillButton>
        </div>

        <button
          onClick={() => setOpen(true)}
          className={`ml-auto rounded-[9px] px-3 py-2 text-[16px] font-bold uppercase lg:hidden ${tone === "light" ? "bg-ink/5 text-ink/80" : "bg-white/10 text-white/90"}`}
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex h-dvh flex-col justify-end lg:hidden"
            initial={{ backgroundColor: "rgba(10,11,20,0)" }}
            animate={{ backgroundColor: "rgba(10,11,20,0.75)" }}
            exit={{ backgroundColor: "rgba(10,11,20,0)" }}
            transition={{ duration: 0.55 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="rounded-t-2xl bg-white p-3 pb-6"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              exit={{ y: "110%" }}
              transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink/10" />
              <nav className="flex flex-col gap-1.5">
                {nav.map((item) => {
                  const isActive = active === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-center rounded-md py-3 text-[16px] font-semibold lowercase ${
                        isActive ? "bg-ink text-white" : "bg-ink/5 text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/join"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center justify-center rounded-full bg-starlight py-3.5 text-[17px] font-bold text-starlight-ink"
                >
                  Join Us
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
