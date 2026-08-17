import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { resendAdapter } from "@payloadcms/email-resend";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Members } from "./collections/Members";
import { Projects } from "./collections/Projects";
import { FlagshipProjects } from "./collections/FlagshipProjects";
import { LegacyPhotos } from "./collections/LegacyPhotos";
import { Avenues } from "./collections/Avenues";
import { Blogs } from "./collections/Blogs";
import { Events } from "./collections/Events";
import { ContactSubmissions } from "./collections/ContactSubmissions";
import { Faqs } from "./collections/Faqs";
import { BoardYears } from "./collections/BoardYears";
import { HomeIntro } from "./globals/HomeIntro";
import { SiteSettings } from "./globals/SiteSettings";
import { HomeSections } from "./globals/HomeSections";
import {
  AdminContactEmailTemplate,
  UserContactEmailTemplate,
} from "./globals/ContactEmailTemplates";
import { cloudinaryAdapter } from "./lib/cloudinaryAdapter";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: "users",
    meta: {
      titleSuffix: " — Coimbatore Main Admin",
      description: "Manage the team and projects shown on the Rotaract Club of Coimbatore Main website.",
      icons: [{ rel: "icon", type: "image/png", url: "/favicon.png" }],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: "/admin/components/Logo#Logo",
        Icon: "/admin/components/Icon#Icon",
      },
      beforeDashboard: ["/admin/components/BeforeDashboard#BeforeDashboard"],
      afterNavLinks: ["/admin/components/AfterNavLinks#AfterNavLinks"],
    },
  },
  editor: lexicalEditor(),
  collections: [
    Projects,
    FlagshipProjects,
    Events,
    Blogs,
    Avenues,
    Members,
    BoardYears,
    LegacyPhotos,
    Faqs,
    Media,
    ContactSubmissions,
    Users,
  ],
  globals: [
    HomeIntro,
    HomeSections,
    SiteSettings,
    AdminContactEmailTemplate,
    UserContactEmailTemplate,
  ],
  // Resend is only wired up when a key is present, so local development and CI
  // fall back to Payload's console transport instead of failing to boot.
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          defaultFromAddress: process.env.EMAIL_FROM || "onboarding@resend.dev",
          defaultFromName: "Rotaract Coimbatore Main",
          apiKey: process.env.RESEND_API_KEY,
        }),
      }
    : {}),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "",
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
    // Legacy alone lives on Cloudinary — everything else stays on Vercel Blob.
    cloudStoragePlugin({
      collections: {
        "legacy-photos": {
          adapter: cloudinaryAdapter({ folder: "rotaract-main/legacy" }),
          disableLocalStorage: true,
          // Without this, the plugin falls back to Payload's own access-
          // controlled proxy URL (/api/legacy-photos/file/...) instead of ever
          // calling the adapter's generateURL — this is what actually turns the
          // stored filename into a real Cloudinary delivery URL on read.
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
});
