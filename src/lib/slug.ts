import type { Field } from "payload";

/** URL-safe slug: strips accents, folds to lowercase, collapses to single hyphens. */
export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // combining diacritics left behind by NFKD
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * A slug that fills itself in from another field when the editor leaves it blank,
 * so nobody has to think about URLs — but stays editable when an entry needs a
 * specific one.
 */
export function slugField(from = "name"): Field {
  return {
    name: "slug",
    type: "text",
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description: "The web address for this entry. Leave blank and it is built from the name.",
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === "string" && value.trim()) return slugify(value);
          const source = data?.[from];
          return typeof source === "string" && source.trim() ? slugify(source) : value;
        },
      ],
    },
  };
}
