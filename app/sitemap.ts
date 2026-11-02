import type { MetadataRoute } from "next";
import { SITE } from "@/lib/tiers";
import { SIZES } from "@/lib/sizes";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, changeFrequency: "daily", priority: 1 }, { url: `${SITE.url}/letter`, changeFrequency: "monthly" as const, priority: 0.8 }, { url: `${SITE.url}/donate`, changeFrequency: "monthly" as const, priority: 0.8 }, ...Object.keys(SIZES).map((s) => ({ url: `${SITE.url}/ram/${s}`, changeFrequency: "weekly" as const, priority: 0.7 }))];
}
