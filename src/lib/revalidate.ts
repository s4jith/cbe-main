import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

// The whole site is small; any content edit revalidates every route.
function revalidateAll(context: { disableRevalidate?: unknown }) {
  if (context?.disableRevalidate) return;
  try {
    revalidatePath("/", "layout");
  } catch {
    // Outside a Next.js request scope (e.g. seed scripts) — nothing to revalidate.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, context }) => {
  revalidateAll(context);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, context }) => {
  revalidateAll(context);
  return doc;
};

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ doc, context }) => {
  revalidateAll(context);
  return doc;
};
