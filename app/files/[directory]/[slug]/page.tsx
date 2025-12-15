import { notFound } from "next/navigation";

import { DossierViewer } from "@/components/dossier/DossierViewer";
import { AppShell } from "@/components/shell/AppShell";
import {
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
  const [directoryCounts, dossier] = await Promise.all([
    getDirectoryCounts(),
    getRecordBySlug(directoryId, params.slug),
  ]);

  if (!dossier) {
    notFound();
  }

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
    >
      <DossierViewer directory={directoryMap[directoryId]} file={dossier} />
    </AppShell>
  );
}
