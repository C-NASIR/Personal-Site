import { AppShell } from "@/components/shell/AppShell";
import { HomeProfile } from "@/components/profile/HomeProfile";
import { buildPageMetadata } from "@/components/seo/metadata";
import { getAllRecords, getDirectoryCounts } from "@/lib/content";
import { getDirectoryMetas } from "@/lib/directories";
import { buildSearchIndex } from "@/lib/search/index";

export const metadata = buildPageMetadata({
  title: "Nasir · Software Engineer",
  path: "/dash",
  description: "Full-stack engineer profile, skills, and mission-ready work.",
});

export default async function DashboardPage() {
  const [directoryCounts, allRecords, directories] = await Promise.all([
    getDirectoryCounts(),
    getAllRecords(),
    getDirectoryMetas(),
  ]);

  const searchDocuments = buildSearchIndex(allRecords);

  return (
    <AppShell
      directories={directories}
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <HomeProfile />
    </AppShell>
  );
}
