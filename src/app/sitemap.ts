import type { MetadataRoute } from "next";

const SITE_URL = "https://verstappen-fan-concept.vercel.app";

/** The public routes of the site. Add a route here when a page is added. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/credits`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
