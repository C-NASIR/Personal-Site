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
  getDirectoryDefinitionById,
  getDirectoryMetas,
  type DirectoryId,
} from "@/lib/directories";

type DirectoryPageProps = {
  params: Promise<{ directory: string }>;
};

export async function generateStaticParams() {
  const directories = await getDirectoryMetas();
  return directories.map((directory) => ({
    directory: directory.id,
  }));
}

export default async function DirectoryPage({ params }: DirectoryPageProps) {
  const { directory } = await params;
  const directorySlug = directory;

  const directoryDefinition = await getDirectoryDefinitionById(directorySlug);

  if (!directoryDefinition) {
    notFound();
  }

  const directoryId = directoryDefinition.id as DirectoryId;
  const [directoryCounts, records, allRecords, directories] = await Promise.all(
    [
      getDirectoryCounts(),
      getDirectoryRecords(directoryId),
      getAllRecords(),
      getDirectoryMetas(),
    ],
  );
  const searchDocuments = buildSearchIndex(allRecords);

  return (
    <AppShell
      directories={directories}
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
