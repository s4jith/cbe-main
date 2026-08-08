// Turns CMS colour values into CSS. A value is either a theme token ("starlight"),
// which resolves to the custom property the Theme global controls, or any literal
// CSS colour the editor typed in.

const TOKENS = new Set([
  "space",
  "space-deep",
  "ink",
  "paper",
  "mist",
  "starlight",
  "starlight-ink",
  "nebula",
  "nebula-ink",
  "comet",
  "comet-ink",
  "cranberry",
  "cranberry-ink",
]);

/** Resolve a stored colour to a CSS colour, or `fallback` when the editor left it blank. */
export function cssColor(value?: string | null): string | undefined;
export function cssColor(value: string | null | undefined, fallback: string): string;
export function cssColor(value?: string | null, fallback?: string): string | undefined {
  const v = (value ?? "").trim();
  if (!v) return fallback;
  if (TOKENS.has(v)) return `var(--color-${v})`;
  if (v === "white") return "#ffffff";
  if (v === "black") return "#000000";
  return v;
}

/** A translucent version of a colour — used for the muted greys in the design. */
export function alpha(color: string | undefined, percent: number): string | undefined {
  if (!color) return undefined;
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/** Colour of body copy on a light or dark section, honouring an editor override. */
export function toneText(tone: "light" | "dark", override?: string | null, opacity = 100): string {
  const base = cssColor(override, tone === "dark" ? "var(--color-paper)" : "var(--color-ink)");
  return opacity >= 100 ? base : (alpha(base, opacity) as string);
}
