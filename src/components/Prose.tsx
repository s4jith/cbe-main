import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

/**
 * CMS richtext rendered into the site's editorial type scale.
 *
 * Tailwind v4 is in use without the typography plugin, so the element styles are
 * declared here as descendant selectors rather than a `prose` class.
 */
export default function Prose({ data, className = "" }: { data: unknown; className?: string }) {
  if (!data) return null;

  return (
    <div
      className={`
        body-text text-ink-soft
        [&_a]:font-semibold [&_a]:text-starlight-deep [&_a]:underline [&_a]:underline-offset-4
        [&_blockquote]:my-7 [&_blockquote]:border-l-2 [&_blockquote]:border-starlight [&_blockquote]:pl-5 [&_blockquote]:text-ink [&_blockquote]:italic
        [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-[30px] [&_h2]:leading-tight [&_h2]:text-ink
        [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:title-sans [&_h3]:text-[21px] [&_h3]:text-ink
        [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:title-sans [&_h4]:text-[17px] [&_h4]:text-ink
        [&_hr]:my-10 [&_hr]:border-line
        [&_img]:my-8 [&_img]:w-full [&_img]:rounded-md
        [&_li]:mb-2 [&_li]:pl-1
        [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6
        [&_p]:mb-5
        [&_strong]:font-semibold [&_strong]:text-ink
        [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6
        ${className}
      `}
    >
      <RichText data={data as SerializedEditorState} disableContainer />
    </div>
  );
}
