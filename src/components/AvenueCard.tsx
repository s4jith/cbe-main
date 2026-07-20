import Image from "next/image";
import Reveal from "@/components/Reveal";
import { ArrowButton } from "@/components/Buttons";

const accents = {
  starlight: "bg-starlight",
  comet: "bg-comet",
  nebula: "bg-nebula",
  cranberry: "bg-cranberry",
} as const;

const dots = {
  starlight: "bg-starlight",
  comet: "bg-comet",
  nebula: "bg-nebula",
  cranberry: "bg-cranberry",
} as const;

export default function AvenueCard({
  title,
  blurb,
  count,
  accent,
  image,
  href,
  index,
}: {
  title: string;
  blurb: string;
  count: number;
  accent: keyof typeof accents;
  image: string;
  href: string;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.06}>
      <div className="flex items-center gap-[6%] rounded-2xl bg-[#1b1e30]/75 p-6 pl-12 max-md:flex-col max-md:gap-6 max-md:p-5">
        <div className="flex-1 max-md:order-2">
          <span className="inline-flex h-8 items-center gap-2.5 rounded-full bg-white/10 px-3 text-[15px] font-semibold text-white">
            <span className={`h-2 w-2 rounded-full ${dots[accent]}`} />
            {count} projects
          </span>
          <h3 className="mt-5 text-[28px] font-extrabold text-white max-md:text-[22px]">{title}</h3>
          <p className="mt-3 max-w-md text-[17px] font-medium leading-relaxed text-white/60">{blurb}</p>
          <div className="mt-6">
            <ArrowButton href={href} variant="light">Explore projects</ArrowButton>
          </div>
        </div>
        <div className={`relative w-[46%] shrink-0 overflow-hidden rounded-md max-md:order-1 max-md:w-full ${accents[accent]}`}>
          <div className="relative aspect-[16/11] m-4 overflow-hidden rounded-md">
            <Image src={image} alt={title} fill sizes="(max-width:768px) 100vw, 520px" className="object-cover" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
