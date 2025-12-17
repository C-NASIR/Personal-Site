import type { ContentRecord } from "@/lib/content/types";
export type SearchDocument = {
  id: string;
  slug: string;
  directory: ContentRecord["directory"];
  title: string;
  summary: string;
  tags: string[];
  classification: ContentRecord["classification"];
  status: ContentRecord["status"];
  updatedAt: string;
  owner?: string;
  preview: string;
  route: string;
  searchable: {
    title: string;
    idSlug: string;
    tags: string;
    summary: string;
    body: string;
  };
};

const BODY_SNIPPET_LENGTH = 320;

export function buildSearchIndex(records: ContentRecord[]): SearchDocument[] {
  return records.map((record) => {
    const bodyText = record.body.replace(/\s+/g, " ").trim();
    const preview = record.summary || bodyText.slice(0, BODY_SNIPPET_LENGTH);
    const fileRoute = `/files/${record.directory}/${record.slug}`;

    return {
      id: record.id,
      slug: record.slug,
      directory: record.directory,
      title: record.title,
      summary: record.summary,
      tags: record.tags,
      classification: record.classification,
      status: record.status,
      updatedAt: record.updatedAt,
      owner: record.owner,
      preview,
      route: fileRoute,
      searchable: {
        title: record.title.toLowerCase(),
        idSlug: `${record.id} ${record.slug}`.toLowerCase(),
        tags: record.tags.join(" ").toLowerCase(),
        summary: record.summary.toLowerCase(),
        body: bodyText.slice(0, BODY_SNIPPET_LENGTH).toLowerCase(),
      },
    };
  });
}
