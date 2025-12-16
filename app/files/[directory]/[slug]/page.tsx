import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DossierViewer } from "@/components/dossier/DossierViewer";
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

interface FileDetailPageProps {
  params: Promise<{ directory: string; slug: string }>;
}

export async function generateStaticParams() {
  const params = await Promise.all(
    (await getDirectoryMetas()).map(async (directory) => {
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
}: FileDetailPageProps): Promise<Metadata> {
  const { directory, slug } = await params;
  const directoryMeta = await getDirectoryDefinitionById(directory);
  if (!directoryMeta) {
    return buildPageMetadata({
      title: "Dossier",
      description: "Classified dossier",
      path: `/files/${directory}/${slug}`,
    });
  }

  const record = await getRecordBySlug(directory, slug);
  if (!record) {
    return buildPageMetadata({
      title: "Dossier",
      description: "Classified dossier",
      path: `/files/${directory}/${slug}`,
    });
  }

  const isDraft = record.status === "DRAFT";

  return buildPageMetadata({
    title: record.title,
    description: record.summary,
    path: `/files/${directory}/${slug}`,
    noindex: isDraft,
  });
}

export default async function FileDetailPage({ params }: FileDetailPageProps) {
  const { directory, slug } = await params;
  const directorySlug = directory;

  const directoryDefinition = await getDirectoryDefinitionById(directorySlug);

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
    { label: dossier.title },
  ];

  return (
    <AppShell
      directories={directories}
      activeDirectory={directoryId}
      breadcrumbs={breadcrumbs}
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <DossierViewer directory={directoryDefinition} file={dossier} />
    </AppShell>
  );
}
