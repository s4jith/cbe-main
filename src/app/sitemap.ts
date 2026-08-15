import type { MetadataRoute } from "next";
import { getBlogs, getEvents, getSiteSettings } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, posts, events] = await Promise.all([getSiteSettings(), getBlogs(), getEvents()]);

  const staticPaths = [
    "",
    "/about",
    "/team",
    "/projects",
    "/events",
    "/blog",
    "/legacy",
    "/contact",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...posts
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${site.url}/blog/${p.slug}`,
        lastModified: p.date || undefined,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      })),
    ...events
      .filter((e) => e.slug)
      .map((e) => ({
        url: `${site.url}/events/${e.slug}`,
        lastModified: e.date || undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
