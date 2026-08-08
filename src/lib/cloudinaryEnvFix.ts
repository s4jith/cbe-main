// The Cloudinary SDK eagerly parses CLOUDINARY_URL the moment it's imported
// and throws if it isn't a well-formed "cloudinary://..." string. This project
// configures Cloudinary explicitly via CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY
// / CLOUDINARY_API_SECRET instead (see cloudinaryAdapter.ts) and never reads
// CLOUDINARY_URL, so it's removed unconditionally before the SDK can see it —
// regardless of whether it's unset, empty, or malformed. Must be imported
// before "cloudinary": ESM evaluates sibling imports in declaration order, so
// this file's body runs first.
delete process.env.CLOUDINARY_URL;
