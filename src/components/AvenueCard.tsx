import Image from "next/image";
import Reveal from "@/components/Reveal";
import { ArrowButton } from "@/components/Buttons";
import { alpha, cssColor } from "@/lib/theme";
import type { Accent } from "@/lib/types";

export default function AvenueCard({
  title,
  blurb,
  count,
  countLabel,
  linkLabel,
  accent,
  image,
  href,
  index,
  background,
  titleColor,
  textColor,
}: {
  title: string;
  blurb: string;
  count: number;
  countLabel: string;
  linkLabel: string;
  accent: Accent;
  image: string;
  href: string;
  index: number;
  background?: string;
  titleColor?: string;
  textColor?: string;
}) {
  const accentColor = `var(--color-${accent})`;
  const heading = cssColor(titleColor, "var(--color-paper)");
  const body = alpha(cssColor(textColor, "var(--color-paper)"), 60);

  return (
    <Reveal delay={index * 0.06}>
      <div
        className="flex items-center gap-[6%] rounded-2xl p-6 pl-12 max-md:flex-col max-md:gap-6 max-md:p-5"
        style={{ backgroundColor: cssColor(background, "rgb(27 30 48 / 0.75)") }}
      >
        <div className="flex-1 max-md:order-2">
          <span
            className="inline-flex h-8 items-center gap-2.5 rounded-full bg-white/10 px-3 text-[15px] font-semibold"
            style={{ color: heading }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentColor }} />
            {count} {countLabel}
          </span>
          <h3 className="mt-5 text-[28px] font-extrabold max-md:text-[22px]" style={{ color: heading }}>
            {title}
          </h3>
          <p className="mt-3 max-w-md text-[17px] font-medium leading-relaxed" style={{ color: body }}>
            {blurb}
          </p>
          {linkLabel && (
            <div className="mt-6">
              <ArrowButton href={href} variant="light">
                {linkLabel}
              </ArrowButton>
            </div>
          )}
        </div>
        <div
          className="relative w-[46%] shrink-0 overflow-hidden rounded-md max-md:order-1 max-md:w-full"
          style={{ backgroundColor: accentColor }}
        >
          <div className="relative aspect-[16/11] m-4 overflow-hidden rounded-md">
            <Image src={image} alt={title} fill sizes="(max-width:768px) 100vw, 520px" className="object-cover" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
