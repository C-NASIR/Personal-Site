import type { MetadataRoute } from "next";

import { getAllRecords } from "@/lib/content";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://xandernova.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const records = await getAllRecords();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/dash",
    "/search",
    "/about",
    "/contact",
    "/credentials",
    "/files/case",
    "/files/intel",
    "/files/logs",
    "/files/credentials",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    priority: path ? 0.8 : 1,
  }));

  const dynamicRoutes: MetadataRoute.Sitemap = records
    .filter((record) => record.directory === "case" || record.directory === "intel")
    .filter((record) => record.status !== "DRAFT")
    .map((record) => ({
      url: `${siteUrl}/files/${record.directory}/${record.slug}`,
      lastModified: new Date(record.updatedAt),
      priority: 0.7,
    }));

  return [...staticRoutes, ...dynamicRoutes];
}

