import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import Prose from "@/components/Prose";
import Reveal from "@/components/Reveal";
import CTABanner from "@/components/CTABanner";
import { PillButton } from "@/components/Buttons";
import { getEventBySlug, getEvents } from "@/lib/content";
import { formatDateTime } from "@/lib/format";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.filter((e) => e.slug).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.name,
    description: `${event.name} — ${event.location}`,
    openGraph: { images: event.image.src ? [event.image.src] : [] },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  return (
    <>
      <SiteHeader tone="light" />
      <main id="main">
        <article>
          <header className="pt-52 pb-12 max-md:pt-32">
            <div className="shell">
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-starlight-deep">
                {event.status === "past" ? "Archive" : event.status}
              </span>
              <h1
                className="headline mt-5 max-w-[18ch] text-ink"
                style={{ "--h-min": "36px", "--h-max": "72px" } as React.CSSProperties}
              >
                {event.name}
              </h1>

              <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
                <div>
                  <dt className="eyebrow text-ink/45">When</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-ink">
                    {event.date ? (
                      <time dateTime={event.date}>{formatDateTime(event.date)}</time>
                    ) : (
                      "To be announced"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink/45">Where</dt>
                  <dd className="mt-1.5 text-[16px] font-semibold text-ink">{event.location}</dd>
                </div>
              </dl>

              {event.registrationLink && event.status !== "past" && (
                <div className="mt-9">
                  <PillButton href={event.registrationLink}>Register</PillButton>
                </div>
              )}
            </div>
          </header>

          {event.image.src && (
            <div className="shell">
              <Reveal y={40}>
                <div className="grain relative aspect-[16/9] overflow-hidden rounded-md bg-mist max-md:aspect-[4/3]">
                  <Image
                    src={event.image.src}
                    alt={event.image.alt}
                    fill
                    priority
                    sizes="(max-width: 1320px) 100vw, 1320px"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          )}

          <div className="shell py-16 max-md:py-12">
            <div className="mx-auto max-w-[68ch]">
              <Prose data={event.description} />
            </div>
          </div>

          {event.gallery.length > 0 && (
            <div className="shell pb-20">
              <div className="grid gap-5 md:grid-cols-3">
                {event.gallery.map((picture, i) => (
                  <Reveal key={i} delay={(i % 3) * 0.08} y={30}>
                    <div className="grain relative aspect-[3/4] overflow-hidden rounded-md bg-mist">
                      <Image
                        src={picture.src}
                        alt={picture.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          <div className="shell pb-20">
            <Link href="/events" className="wipe-link text-[15px] font-semibold text-ink">
              ← All events
            </Link>
          </div>
        </article>

        <CTABanner />
      </main>
      <SiteFooter />
    </>
  );
}
