import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio"] },
      { userAgent: "*", disallow: ["/studio"] },
    ],
    sitemap: "https://fieldnotes.example/sitemap.xml",
  };
}
