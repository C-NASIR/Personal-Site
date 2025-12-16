import { SearchPage } from "@/components/search/SearchPage";
import { AppShell } from "@/components/shell/AppShell";
import { buildPageMetadata } from "@/components/seo/metadata";
import { getAllRecords, getDirectoryCounts } from "@/lib/content";
import { getDirectoryMetas } from "@/lib/directories";
import { buildSearchIndex } from "@/lib/search/index";

export const metadata = buildPageMetadata({
  title: "Search",
  path: "/search",
  description: "Global dossier and intel search.",
});

export default async function SearchRoutePage() {
  const [directoryCounts, records, directories] = await Promise.all([
    getDirectoryCounts(),
    getAllRecords(),
    getDirectoryMetas(),
  ]);

  const searchDocuments = buildSearchIndex(records);

  return (
    <AppShell
      directories={directories}
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
      breadcrumbs={[{ label: "Search" }]}
    >
      <SearchPage documents={searchDocuments} />
    </AppShell>
  );
}
