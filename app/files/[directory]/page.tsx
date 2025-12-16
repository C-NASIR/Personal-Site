import { notFound } from "next/navigation";

import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { AppShell } from "@/components/shell/AppShell";
import {
  getAllRecords,
  getDirectoryCounts,
  getDirectoryRecords,
} from "@/lib/content";
import { buildSearchIndex } from "@/lib/search/index";
import {
  directories,
  isDirectoryId,
  type DirectoryId,
} from "@/lib/directories";

type DirectoryPageProps = {
  params: Promise<{ directory: string }>;
};

export async function generateStaticParams() {
  return directories.map((directory) => ({
    directory: directory.id,
  }));
}

export default async function DirectoryPage({ params }: DirectoryPageProps) {
  const { directory } = await params;
  const directorySlug = directory;

  if (!isDirectoryId(directorySlug)) {
    notFound();
  }

  const directoryId = directorySlug as DirectoryId;
  const [directoryCounts, records, allRecords] = await Promise.all([
    getDirectoryCounts(),
    getDirectoryRecords(directoryId),
    getAllRecords(),
  ]);
  const searchDocuments = buildSearchIndex(allRecords);

  return (
    <AppShell
      activeDirectory={directoryId}
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <DashboardScreen
        key={directoryId}
        directory={directoryId}
        records={records}
      />
    </AppShell>
  );
}
