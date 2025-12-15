import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://xandernova.dev";
const baseTitle = "Xander Nova // Classified Portfolio";
const defaultDescription =
  "Classified-inspired portfolio by Xander Nova, a principal product engineer building trustworthy internal systems.";

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
  },
  twitter: {
    card: "summary_large_image",
    title: baseTitle,
    description: defaultDescription,
  },
};

export function buildPageMetadata({
  title,
  description = defaultDescription,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = `${title} • ${baseTitle}`;
  const url = path ? `${baseUrl}${path}` : baseUrl;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: baseTitle,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

