/**
 * The social marks, drawn inline so the footer costs no extra requests and the
 * glyphs inherit colour from their link.
 *
 * Keyed by the platform names the CMS offers; anything unrecognised falls back
 * to a generic link mark rather than rendering an empty box.
 */
const PATHS: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" />
    </>
  ),
  facebook: (
    <path
      d="M14.5 8.5h2.2V5.6h-2.6c-2.4 0-3.9 1.5-3.9 4v2.1H8v3h2.2V21h3.1v-6.3h2.3l.4-3h-2.7v-1.7c0-.9.4-1.5 1.2-1.5Z"
      fill="currentColor"
    />
  ),
  linkedin: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7.2 10.2v7m0-10.1v.1M11.4 17.2v-4a2.3 2.3 0 0 1 4.6 0v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
  x: (
    <path
      d="M3.2 3h4.3l4.5 6 5.2-6h2.4l-6.5 7.5L20.8 21h-4.3l-4.8-6.4L6 21H3.6l6.9-7.9L3.2 3Z"
      fill="currentColor"
    />
  ),
  youtube: (
    <>
      <rect x="2.2" y="5.5" width="19.6" height="13" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.3 9.4v5.2L14.9 12l-4.6-2.6Z" fill="currentColor" />
    </>
  ),
  whatsapp: (
    <path
      d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm4.6 12.4c-.2.6-1.1 1.1-1.6 1.1-.4 0-.9.2-3-.7-2.5-1.1-4.1-3.7-4.2-3.9-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2 .2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.5c-.1.2-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.7 1.1 2 1.2.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.6-.1l1.8.9c.2.1.4.2.5.3.1.2.1.6-.2 1.1Z"
      fill="currentColor"
    />
  ),
};

const GENERIC = (
  <path
    d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 1 0-5-5l-1 1m-2 6a3.5 3.5 0 0 1-5 0 3.5 3.5 0 0 1 0-5l1-1"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
  />
);

export default function SocialIcon({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      {PATHS[name.trim().toLowerCase()] ?? GENERIC}
    </svg>
  );
}
