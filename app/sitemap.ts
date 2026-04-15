import type { MetadataRoute } from "next";

import { getBuyerPageData } from "@/lib/data/queries";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/buyer"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/sell"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const { kits } = await getBuyerPageData();

    return [
      ...baseEntries,
      ...kits.map((kit) => ({
        url: absoluteUrl(`/buyer/kits/${kit.id}`),
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: kit.status === "verified" ? 0.8 : 0.7,
      })),
    ];
  } catch {
    return baseEntries;
  }
}
