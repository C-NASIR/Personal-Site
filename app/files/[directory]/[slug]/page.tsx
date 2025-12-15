import { notFound } from "next/navigation";

import { DossierViewer } from "@/components/dossier/DossierViewer";
import { AppShell } from "@/components/shell/AppShell";
import {
  directoryMap,
  directoryRoute,
  getFileBySlug,
  isDirectoryId,
  type DirectoryId,
} from "@/lib/mockData";

type FileDetailPageProps = {
  params: { directory: string; slug: string };
};

export default function FileDetailPage({ params }: FileDetailPageProps) {
  const directorySlug = params.directory;

  if (!isDirectoryId(directorySlug)) {
    notFound();
  }

  const directoryId = directorySlug as DirectoryId;
  const dossier = getFileBySlug(directoryId, params.slug);

  if (!dossier) {
    notFound();
  }

  const breadcrumbs = [
    { label: directoryMap[directoryId].label, href: directoryRoute(directoryId) },
    { label: dossier.title },
  ];

  return (
    <AppShell activeDirectory={directoryId} breadcrumbs={breadcrumbs}>
      <DossierViewer directory={directoryMap[directoryId]} file={dossier} />
    </AppShell>
  );
}

