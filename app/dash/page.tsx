import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { AppShell } from "@/components/shell/AppShell";
import { buildPageMetadata } from "@/components/seo/metadata";
import {
  getAllRecords,
  getDirectoryCounts,
  getDirectoryRecords,
} from "@/lib/content";
import { getDirectoryMetas } from "@/lib/directories";
import { buildSearchIndex } from "@/lib/search/index";

export const metadata = buildPageMetadata({
  title: "Dashboard",
  path: "/dash",
  description: "Main dossier dashboard with directories and intel logs.",
});

export default async function DashboardPage() {
  const [directoryCounts, records, allRecords, directories] = await Promise.all(
    [
      getDirectoryCounts(),
      getDirectoryRecords("case"),
      getAllRecords(),
      getDirectoryMetas(),
    ],
  );

  const searchDocuments = buildSearchIndex(allRecords);

  return (
    <AppShell
      directories={directories}
      activeDirectory="case"
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <DashboardScreen key="case" directory="case" records={records} />
    </AppShell>
  );
}
