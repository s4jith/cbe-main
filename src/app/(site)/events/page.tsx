import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Reveal from "@/components/Reveal";
import { getEvents } from "@/lib/content";
import { formatDateTime } from "@/lib/format";
import type { EventSummary } from "@/lib/types";

export const metadata: Metadata = {
  title: "Events",
  description:
    "What the Rotaract Club of Coimbatore Main has coming up, and what we have already run.",
};

export default async function EventsIndex() {
  const events = await getEvents();
  // "Past" is the archive; upcoming and ongoing both lead the page, soonest first.
  const current = events
    .filter((e) => e.status !== "past")
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => e.status === "past");

  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <section className="pt-52 pb-16 max-md:pt-32">
          <div className="shell">
            <p className="eyebrow text-ink/45">What&rsquo;s on</p>
            <h1
              className="headline mt-5 max-w-[14ch] text-ink"
              style={{ "--h-min": "40px", "--h-max": "78px" } as React.CSSProperties}
            >
              Events.
            </h1>
          </div>
        </section>

        {events.length === 0 && (
          <section className="pb-24">
            <div className="shell">
              <p className="body-text text-ink-soft">
                Nothing scheduled just now — follow along on social for the next one.
              </p>
            </div>
          </section>
        )}

        {current.length > 0 && (
          <section className="pb-20">
            <div className="shell grid gap-x-8 gap-y-12 md:grid-cols-2">
              {current.map((event, i) => (
                <Reveal key={event.id} delay={(i % 2) * 0.08} y={34}>
                  <EventCard event={event} featured />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="border-t border-line py-20">
            <div className="shell">
              <p className="eyebrow mb-10 text-ink/45">Archive</p>
              <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
                {past.map((event, i) => (
                  <Reveal key={event.id} delay={(i % 3) * 0.08} y={30}>
                    <EventCard event={event} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <SiteFooter />
    </>
  );
}

function EventCard({ event, featured = false }: { event: EventSummary; featured?: boolean }) {
  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <div
        className={`grain relative overflow-hidden rounded-md bg-mist ${
          featured ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={event.image.src}
          alt={event.image.alt}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        {event.status !== "past" && (
          <span className="absolute left-4 top-4 rounded-full bg-starlight px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-starlight-ink">
            {event.status}
          </span>
        )}
      </div>

      <div className="mt-5">
        <h2
          className={`title-sans leading-snug text-ink ${featured ? "text-[24px]" : "text-[19px]"}`}
        >
          {event.name}
        </h2>
        <p className="mt-2 text-[14px] font-medium text-ink-soft">{event.location}</p>
        {event.date && (
          <time dateTime={event.date} className="mt-1 block text-[13px] font-medium text-ink/45">
            {formatDateTime(event.date)}
          </time>
        )}
      </div>
    </Link>
  );
}
