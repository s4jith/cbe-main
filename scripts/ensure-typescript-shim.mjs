// TypeScript 7's package.json only exports "." (lib/version.cjs) and
// "./unstable/*" — it dropped the legacy "lib/typescript.js" entry point.
// Next.js 16.2.10's built-in dependency check (has-necessary-dependencies.js)
// does a hard fs.existsSync() for that exact path to decide whether
// TypeScript is "installed". Without it, Next thinks TS is missing, tries
// to auto-install it on every build, and in CI (isCI=true, e.g. Vercel)
// that path throws instead of retrying — killing the build with no
// visible error message.
//
// We already run our own `tsc --noEmit` (real tsc binary) and have
// `typescript.ignoreBuildErrors: true` in next.config.ts, so Next never
// actually needs to `require()` this file — it only needs to exist.
// Safe to remove once Next ships TS7-aware detection.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const require = (await import("node:module")).createRequire(import.meta.url);

let tsPkgPath;
try {
  tsPkgPath = require.resolve("typescript/package.json");
} catch {
  process.exit(0); // typescript not installed; nothing to shim
}

const shimPath = join(dirname(tsPkgPath), "lib", "typescript.js");

if (!existsSync(shimPath)) {
  mkdirSync(dirname(shimPath), { recursive: true });
  writeFileSync(
    shimPath,
    "// Shim for Next.js dependency detection — see scripts/ensure-typescript-shim.mjs\n",
  );
  console.log("[ensure-typescript-shim] created", shimPath);
}
