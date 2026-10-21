import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin/" },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
