import type { MetadataRoute } from "next";
import { SITE } from "@/lib/tiers";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: SITE.url, changeFrequency: "daily", priority: 1 }]; }
