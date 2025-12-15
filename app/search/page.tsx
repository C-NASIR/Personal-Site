import { SearchPage } from "@/components/search/SearchPage";
import { AppShell } from "@/components/shell/AppShell";
import { getAllRecords, getDirectoryCounts } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search/index";

export default async function SearchRoutePage() {
  const [directoryCounts, records] = await Promise.all([
    getDirectoryCounts(),
    getAllRecords(),
  ]);

  const searchDocuments = buildSearchIndex(records);

  return (
    <AppShell
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
      breadcrumbs={[{ label: "Search" }]}
    >
      <SearchPage documents={searchDocuments} />
    </AppShell>
  );
}

