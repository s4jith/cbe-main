import type { ReactNode } from "react";

/** Infinite CSS marquee (duplicated track), pauses on hover. */
export default function Marquee({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`group flex overflow-hidden ${className}`}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className="flex shrink-0 animate-[marquee_28s_linear_infinite] items-center gap-12 pr-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {children}
        </div>
      ))}
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-100%); } }`}</style>
    </div>
  );
}
