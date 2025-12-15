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
  directories,
  directoryMap,
  directoryRoute,
  isDirectoryId,
  type DirectoryId,
} from "@/lib/directories";
import { buildSearchIndex } from "@/lib/search/index";

interface FileDetailPageProps {
  params: { directory: string; slug: string };
}

export async function generateStaticParams() {
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

export default async function FileDetailPage({ params }: FileDetailPageProps) {
  const directorySlug = params.directory;

  if (!isDirectoryId(directorySlug)) {
    notFound();
  }

  const directoryId = directorySlug as DirectoryId;
  const [directoryCounts, dossier, allRecords] = await Promise.all([
    getDirectoryCounts(),
    getRecordBySlug(directoryId, params.slug),
    getAllRecords(),
  ]);

  if (!dossier) {
    notFound();
  }

  const searchDocuments = buildSearchIndex(allRecords);

  const breadcrumbs = [
    {
      label: directoryMap[directoryId].label,
      href: directoryRoute(directoryId),
    },
    { label: dossier.title },
  ];

  return (
    <AppShell
      activeDirectory={directoryId}
      breadcrumbs={breadcrumbs}
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <DossierViewer directory={directoryMap[directoryId]} file={dossier} />
    </AppShell>
  );
}
