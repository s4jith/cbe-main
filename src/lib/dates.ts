// Club-year math. The club's year runs 1 July – 30 June (the Rotary/Rotaract
// convention, matching the leadership term), not the calendar year — so a
// project dated any month from July through December belongs to that
// calendar year's edition, and January through June belongs to the one that
// started the July before.

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export type ClubYear = { key: number; label: string };

/** `2025-01-15` → the year that started July 2024, labelled "2024–25". */
export function clubYearOf(dateISO: string): ClubYear {
  const d = new Date(dateISO);
  const y = d.getUTCFullYear();
  const startYear = d.getUTCMonth() >= 6 ? y : y - 1; // July = month index 6
  return { key: startYear, label: `${startYear}–${String((startYear + 1) % 100).padStart(2, "0")}` };
}

/** 0-based month index and its full English name, read from an ISO date string. */
export function monthOf(dateISO: string): { index: number; label: string } {
  const index = new Date(dateISO).getUTCMonth();
  return { index, label: MONTHS[index] };
}
