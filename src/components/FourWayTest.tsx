import FourWayTestClient from "@/components/FourWayTestClient";
import { getShared } from "@/lib/content";

/** Rotary's Four-Way Test — the calm centre of the page. */
export default function FourWayTest() {
  const { fourWayTest } = getShared();

  return (
    <section className="section-y bg-paper">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <p className="eyebrow text-ink/45">The Four-Way Test</p>
          </div>
          <div className="lg:col-span-9">
            <p className="lede max-w-[42ch] text-ink-soft">{fourWayTest.eyebrow}</p>
            <FourWayTestClient data={fourWayTest} />
          </div>
        </div>
      </div>
    </section>
  );
}
