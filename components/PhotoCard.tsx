import Image from "next/image";

/** 24px-radius media card with bottom scrim + name/stat overlay. */
export default function PhotoCard({
  image,
  title,
  sub,
  className = "",
  sizes = "312px",
  priority = false,
}: {
  image: string;
  title: string;
  sub?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl shadow-card ${className}`}>
      <Image src={image} alt={title} fill sizes={sizes} priority={priority} className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="text-[20px] font-bold text-white">{title}</div>
        {sub && (
          <div className="mt-1 flex items-center gap-2 text-[14px] font-semibold text-white/90">
            <span className="text-starlight">↗</span>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}
