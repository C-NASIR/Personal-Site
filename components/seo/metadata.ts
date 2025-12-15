import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://xandernova.dev";
const baseTitle = "Secret Systems Portfolio • Xander Nova";
const defaultDescription =
  "Xander Nova builds classified-inspired internal systems, dashboards, and developer platforms for high trust teams.";
const ogImage = `${baseUrl}/opengraph-image`;

export const siteMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: baseTitle,
  description: defaultDescription,
  openGraph: {
    title: baseTitle,
    description: defaultDescription,
    url: baseUrl,
    siteName: baseTitle,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: baseTitle,
    description: defaultDescription,
    images: [ogImage],
  },
};

export function buildPageMetadata({
  title,
  description = defaultDescription,
  path = "",
  noindex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
}): Metadata {
  const fullTitle = `${title} • ${baseTitle}`;
  const url = path ? `${baseUrl}${path}` : baseUrl;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: baseTitle,
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
