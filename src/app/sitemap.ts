import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://fieldnotes.example", lastModified: new Date("2026-08-18"), changeFrequency: "weekly", priority: 1 },
    { url: "https://fieldnotes.example/stories/quiet-power-of-a-well-made-morning", lastModified: new Date("2026-08-18"), changeFrequency: "yearly", priority: 0.8 },
    { url: "https://fieldnotes.example/studio", changeFrequency: "monthly", priority: 0.3 },
  ];
}