import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ButtonData } from "@/lib/types";
import { cssColor } from "@/lib/theme";

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden
  >
    <path
      d="M2.5 11.5 11.5 2.5M11.5 2.5H4.75M11.5 2.5V9.25"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * The single loud element on the page — deliberately the only pill in the system.
 * Everything else is a text-and-arrow link so the photography stays dominant.
 */
export function PillButton({
  href,
  children,
  style,
  className = "",
}: {
  href: string;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <Link
      href={href}
      style={style}
      className={`jelly h-11 items-center rounded-full bg-starlight px-5 text-[14px] font-semibold tracking-[-0.01em] text-starlight-ink ${className}`}
    >
      {children}
    </Link>
  );
}

/**
 * Editorial secondary action: a tracked-out label over a hairline, with the arrow
 * stepping out on hover. `variant` picks the colour for a light or dark surface.
 */
export function ArrowButton({
  href,
  children,
  variant = "light",
  className = "",
  style,
}: {
  href: string;
  children: ReactNode;
  /** "light" = light text for dark surfaces; "dark" = ink text for light surfaces. */
  variant?: "light" | "dark";
  className?: string;
  style?: CSSProperties;
}) {
  const tone = variant === "light" ? "text-paper" : "text-ink";
  const rule = variant === "light" ? "border-line-invert" : "border-line-strong";

  return (
    <Link
      href={href}
      style={style}
      className={`group/arrow inline-flex items-center gap-2.5 border-b pb-1.5 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${tone} ${rule} hover:border-current ${className}`}
    >
      {children}
      <Arrow className="transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover/arrow:translate-x-0.5 group-hover/arrow:-translate-y-0.5" />
    </Link>
  );
}

/** Renders whichever button the content layer configured — or nothing, if hidden. */
export function CmsButton({ data, className = "" }: { data: ButtonData; className?: string }) {
  if (data.hidden || !data.label.trim()) return null;

  const style: CSSProperties = {};
  const background = cssColor(data.background);
  const color = cssColor(data.color);
  if (background) style.backgroundColor = background;
  if (color) style.color = color;

  if (data.style === "pill") {
    return (
      <PillButton href={data.href} style={style} className={className}>
        {data.label}
      </PillButton>
    );
  }
  return (
    <ArrowButton
      href={data.href}
      variant={data.style === "arrow-dark" ? "dark" : "light"}
      style={style}
      className={className}
    >
      {data.label}
    </ArrowButton>
  );
}
