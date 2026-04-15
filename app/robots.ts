import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/buyer", "/sell", "/contact", "/buyer/kits"],
        disallow: ["/admin", "/account", "/drivers", "/buyer/checkout", "/buyer/orders", "/sell/submit", "/sell/status", "/api"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
