import { notFound } from "next/navigation";

import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { AppShell } from "@/components/shell/AppShell";
import { isDirectoryId, type DirectoryId } from "@/lib/mockData";

type DirectoryPageProps = {
  params: { directory: string };
};

export default function DirectoryPage({ params }: DirectoryPageProps) {
  const directorySlug = params.directory;

  if (!isDirectoryId(directorySlug)) {
    notFound();
  }

  const directoryId = directorySlug as DirectoryId;

  return (
    <AppShell activeDirectory={directoryId}>
      <DashboardScreen directory={directoryId} />
    </AppShell>
  );
}

