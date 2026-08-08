import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteSettings();
  return ["", "/about", "/team", "/projects", "/legacy", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
