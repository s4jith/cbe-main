import Link from "next/link";
import type { ReactNode } from "react";

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M2 13.5C6 13 12 10 13.5 3M13.5 3H8.5M13.5 3V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Primary CTA — the one loud pill (starlight gold). */
export function PillButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="jelly h-14 items-center rounded-full bg-starlight px-6 text-[17px] font-bold text-starlight-ink"
    >
      {children}
    </Link>
  );
}

/** Secondary CTA — quiet rectangular button, light or dark surface variant. */
export function ArrowButton({
  href,
  children,
  variant = "light",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "light" | "dark";
  className?: string;
}) {
  const skin =
    variant === "light"
      ? "bg-white text-ink"
      : "bg-space text-white";
  return (
    <Link
      href={href}
      className={`jelly h-[42px] items-center gap-3 rounded-[9px] px-4 text-[17px] font-bold max-md:h-[50px] max-md:w-full max-md:justify-center ${skin} ${className}`}
    >
      <Arrow />
      {children}
    </Link>
  );
}
