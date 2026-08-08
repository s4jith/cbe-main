import "./cloudinaryEnvFix";
import { v2 as cloudinary } from "cloudinary";
import type { Adapter } from "@payloadcms/plugin-cloud-storage/types";

// There's no official @payloadcms/storage-cloudinary plugin, so this implements
// the same Adapter interface the official S3/Vercel Blob/GCS plugins do, backed
// by Cloudinary's own SDK. Scoped to a single collection at a time — the site
// keeps its main Media library on Vercel Blob and only opts specific
// collections (Legacy) into Cloudinary via payload.config.ts.

// .trim() defensively: a stray tab/space pasted into .env alongside a
// credential is invisible in any editor but makes Cloudinary reject it outright
// ("unknown api_key") — trimming here means that class of mistake can't
// resurface at runtime even if the .env file isn't cleaned up.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
  analytics: false, // otherwise every generated URL carries an SDK-tracking query param
});

/** Split "legacy-12.webp" into { id: "legacy-12", ext: "webp" }. */
function splitFilename(filename: string): { id: string; ext?: string } {
  const match = filename.match(/^(.*)\.([^./]+)$/);
  return match ? { id: match[1], ext: match[2].toLowerCase() } : { id: filename };
}

/** One Cloudinary adapter per folder, so different collections don't collide. */
export function cloudinaryAdapter({ folder }: { folder: string }): Adapter {
  return () => ({
    name: "cloudinary",

    handleUpload: async ({ file }) => {
      const { id } = splitFilename(file.filename);
      await new Promise<void>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: id,
            overwrite: true,
            resource_type: "image",
          },
          (err) => (err ? reject(err) : resolve()),
        );
        stream.end(file.buffer);
      });
    },

    handleDelete: async ({ filename }) => {
      const { id } = splitFilename(filename);
      await cloudinary.uploader.destroy(`${folder}/${id}`, { resource_type: "image" });
    },

    generateURL: ({ filename }) => {
      const { id, ext } = splitFilename(filename);
      return cloudinary.url(`${folder}/${id}`, {
        secure: true,
        format: ext,
        // f_auto/q_auto: Cloudinary picks the best format (AVIF/WebP) and
        // compression per requesting browser, on top of whatever we uploaded.
        fetch_format: "auto",
        quality: "auto",
      });
    },

    staticHandler: async (_req, { params: { filename } }) => {
      const { id, ext } = splitFilename(filename);
      const url = cloudinary.url(`${folder}/${id}`, { secure: true, format: ext });
      return Response.redirect(url, 302);
    },
  });
}
