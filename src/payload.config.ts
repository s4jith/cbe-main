import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Members } from "./collections/Members";
import { Projects } from "./collections/Projects";
import { FlagshipProjects } from "./collections/FlagshipProjects";
import { Publications } from "./collections/Publications";
import { Voices } from "./collections/Voices";
import { SiteSettings } from "./globals/SiteSettings";
import { HomePage } from "./globals/HomePage";
import { AboutPage } from "./globals/AboutPage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    meta: {
      titleSuffix: " — Gaalaxy Admin",
    },
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Members, Projects, FlagshipProjects, Publications, Voices],
  globals: [SiteSettings, HomePage, AboutPage],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || "",
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
