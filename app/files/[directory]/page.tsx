import { notFound } from "next/navigation";

import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { AppShell } from "@/components/shell/AppShell";
import {
  getDirectoryCounts,
  getDirectoryRecords,
} from "@/lib/content";
import {
  directories,
  isDirectoryId,
  type DirectoryId,
} from "@/lib/directories";

type DirectoryPageProps = {
  params: { directory: string };
};

export async function generateStaticParams() {
  return directories.map((directory) => ({
    directory: directory.id,
  }));
}

export default async function DirectoryPage({ params }: DirectoryPageProps) {
  const directorySlug = params.directory;

  if (!isDirectoryId(directorySlug)) {
    notFound();
  }

  const directoryId = directorySlug as DirectoryId;
  const [directoryCounts, records] = await Promise.all([
    getDirectoryCounts(),
    getDirectoryRecords(directoryId),
  ]);

  return (
    <AppShell
      activeDirectory={directoryId}
      directoryCounts={directoryCounts}
    >
      <DashboardScreen
        key={directoryId}
        directory={directoryId}
        records={records}
      />
    </AppShell>
  );
}
