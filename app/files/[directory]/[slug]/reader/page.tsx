import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DossierReader } from "@/components/dossier/DossierReader";
import { AppShell } from "@/components/shell/AppShell";
import {
  getAllRecords,
  getAllSlugsByDirectory,
  getDirectoryCounts,
  getRecordBySlug,
} from "@/lib/content";
import {
  getDirectoryDefinitionById,
  getDirectoryMetas,
  type DirectoryId,
} from "@/lib/directories";
import { buildSearchIndex } from "@/lib/search/index";
import { buildPageMetadata } from "@/components/seo/metadata";

interface ReaderPageProps {
  params: Promise<{ directory: string; slug: string }>;
}

export async function generateStaticParams() {
  const directories = await getDirectoryMetas();
  const params = await Promise.all(
    directories.map(async (directory) => {
      const slugs = await getAllSlugsByDirectory(directory.id);
      return slugs.map((slug) => ({
        directory: directory.id,
        slug,
      }));
    }),
  );

  return params.flat();
}

export async function generateMetadata({
  params,
}: ReaderPageProps): Promise<Metadata> {
  const { directory, slug } = await params;
  const directoryMeta = await getDirectoryDefinitionById(directory);
  if (!directoryMeta) {
    return buildPageMetadata({
      title: "Dossier",
      description: "Reader view",
      path: `/files/${directory}/${slug}/reader`,
    });
  }

  const record = await getRecordBySlug(directoryMeta.id, slug);
  if (!record) {
    return buildPageMetadata({
      title: "Dossier",
      description: "Reader view",
      path: `/files/${directory}/${slug}/reader`,
    });
  }

  const isDraft = record.status === "DRAFT";

  return buildPageMetadata({
    title: `${record.title} · Reader`,
    description: record.summary,
    path: `/files/${directory}/${slug}/reader`,
    noindex: isDraft,
  });
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { directory, slug } = await params;
  const directoryDefinition = await getDirectoryDefinitionById(directory);

  if (!directoryDefinition) {
    notFound();
  }

  const directoryId = directoryDefinition.id as DirectoryId;
  const [directoryCounts, dossier, allRecords, directories] = await Promise.all(
    [
      getDirectoryCounts(),
      getRecordBySlug(directoryId, slug),
      getAllRecords(),
      getDirectoryMetas(),
    ],
  );

  if (!dossier) {
    notFound();
  }

  const searchDocuments = buildSearchIndex(allRecords);

  const breadcrumbs = [
    {
      label: directoryDefinition.label,
      href: directoryDefinition.route,
    },
    { label: dossier.title, href: `/files/${directoryId}/${dossier.slug}` },
    { label: "Reader View" },
  ];

  return (
    <AppShell
      directories={directories}
      activeDirectory={directoryId}
      breadcrumbs={breadcrumbs}
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <DossierReader directory={directoryDefinition} file={dossier} />
    </AppShell>
  );
}
