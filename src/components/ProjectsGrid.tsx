"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import type { Avenue, AvenueInfo, Project } from "@/lib/types";
import { MONTHS, clubYearOf, monthOf } from "@/lib/dates";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const ALL = "All";

/** Minimal underlined select — matches the editorial system's text-first controls. */
function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="group relative flex items-center gap-2 border-b border-line-strong pb-1.5 text-[13px] font-medium text-ink transition-colors focus-within:border-ink hover:border-ink">
      <span className="text-ink/40">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent pr-4 text-ink outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        width="9"
        height="6"
        viewBox="0 0 9 6"
        fill="none"
        aria-hidden
        className="pointer-events-none absolute right-0 text-ink/40"
      >
        <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </label>
  );
}

/** Filterable, club-year-segregated project index with FLIP layout animation. */
export default function ProjectsGrid({
  projects,
  avenues,
  allLabel = "All",
  emptyMessage,
}: {
  projects: Project[];
  avenues: AvenueInfo[];
  allLabel?: string;
  emptyMessage?: string;
}) {
  // ?avenue=community is applied here rather than read from searchParams on the
  // server: touching searchParams opted the whole route out of ISR, so every
  // visit paid a cold MongoDB round trip. Reading it after mount instead lets
  // the page prerender with the full project list — which is also what crawlers see.
  const [avenue, setAvenue] = useState<Avenue | "All">("All");
  const [year, setYear] = useState(ALL);
  const [month, setMonth] = useState(ALL);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("avenue");
    if (!slug) return;
    const match = avenues.find((a) => a.slug === slug);
    if (match) setAvenue(match.key);
  }, [avenues]);

  const years = useMemo(() => {
    const seen = new Map<number, string>();
    for (const p of projects) {
      if (!p.date) continue;
      const y = clubYearOf(p.date);
      seen.set(y.key, y.label);
    }
    return [...seen.entries()].sort((a, b) => b[0] - a[0]);
  }, [projects]);

  const filtered = useMemo(
    () =>
      projects.filter((p) => {
        if (avenue !== "All" && p.avenue !== avenue) return false;
        if (year !== ALL && (!p.date || String(clubYearOf(p.date).key) !== year)) return false;
        if (month !== ALL && (!p.date || String(monthOf(p.date).index) !== month)) return false;
        return true;
      }),
    [projects, avenue, year, month],
  );

  // Grouped by club year, most recent first; undated projects (schema requires a
  // date going forward, but older or hand-edited docs might still lack one) fall
  // into a trailing group rather than disappearing.
  const groups = useMemo(() => {
    const byYear = new Map<string, { label: string; items: Project[] }>();
    for (const p of filtered) {
      const y = p.date ? clubYearOf(p.date) : null;
      const key = y ? String(y.key) : "undated";
      const label = y ? y.label : "Undated";
      if (!byYear.has(key)) byYear.set(key, { label, items: [] });
      byYear.get(key)!.items.push(p);
    }
    for (const g of byYear.values()) {
      g.items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    }
    return [...byYear.entries()]
      .sort(([a], [b]) => (a === "undated" ? 1 : b === "undated" ? -1 : Number(b) - Number(a)))
      .map(([key, g]) => ({ key, ...g }));
  }, [filtered]);

  const pills: { label: string; value: Avenue | "All"; accent?: string; count: number }[] = [
    { label: allLabel, value: "All", count: projects.length },
    ...avenues.map((a) => ({
      label: a.key.replace(" Service", "").replace(" Priority", " Priority"),
      value: a.key,
      accent: a.accent,
      count: projects.filter((p) => p.avenue === a.key).length,
    })),
  ];

  return (
    <div>
      <div
        className="sticky z-20 -mx-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 bg-paper/90 px-4 py-4 backdrop-blur-md"
        style={{ top: "var(--header-h, 68px)" }}
      >
        <div className="flex flex-wrap gap-2">
          {pills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => setAvenue(pill.value)}
              className={`relative flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-colors ${
                avenue === pill.value ? "" : "bg-ink/5 text-ink/70 hover:bg-ink/10"
              }`}
              style={avenue === pill.value ? { color: "var(--color-paper)" } : undefined}
            >
              {avenue === pill.value && (
                <m.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              {pill.accent && (
                <span
                  className="relative h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: `var(--color-${pill.accent})` }}
                />
              )}
              <span className="relative">{pill.label}</span>
              <span className="relative text-[11px] opacity-55">{pill.count}</span>
            </button>
          ))}
        </div>

        {years.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <FilterSelect
              label="Year"
              value={year}
              onChange={setYear}
              options={[{ value: ALL, label: "All years" }, ...years.map(([k, l]) => ({ value: String(k), label: l }))]}
            />
            <FilterSelect
              label="Month"
              value={month}
              onChange={setMonth}
              options={[
                { value: ALL, label: "All months" },
                ...MONTHS.map((name, i) => ({ value: String(i), label: name })),
              ]}
            />
          </div>
        )}
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          {groups.length === 0 ? (
            emptyMessage && (
              <m.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-10 text-[17px] font-medium text-ink/60"
              >
                {emptyMessage}
              </m.p>
            )
          ) : (
            <m.div key={`${avenue}-${year}-${month}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {groups.map((g) => (
                <section key={g.key} className="pt-14 first:pt-6">
                  <div className="mb-6 flex items-baseline gap-4">
                    <h2 className="eyebrow text-ink/45">{g.label}</h2>
                    <span className="h-px flex-1 bg-line" aria-hidden />
                    <span className="text-[12px] text-ink/35">
                      {g.items.length} {g.items.length === 1 ? "project" : "projects"}
                    </span>
                  </div>

                  <m.ul layout className="grid grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1">
                    {g.items.map((p, i) => (
                      <m.li
                        layout
                        key={`${p.avenue}-${p.title}-${p.date}`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 5) * 0.04 }}
                        className="group"
                      >
                        <div className="grain relative aspect-[4/3] overflow-hidden bg-mist">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            loading="lazy"
                            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]"
                          />
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              backgroundColor: `var(--color-${avenues.find((a) => a.key === p.avenue)?.accent ?? "starlight"})`,
                            }}
                          />
                          <span className="text-[12px] uppercase tracking-[0.1em] text-ink/40">{p.avenue}</span>
                        </div>
                        <h3 className="mt-2 text-[19px] font-medium tracking-[-0.01em] text-ink">{p.title}</h3>
                        <p className="body-text mt-1.5 line-clamp-3 text-ink-soft">{p.description}</p>
                      </m.li>
                    ))}
                  </m.ul>
                </section>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
