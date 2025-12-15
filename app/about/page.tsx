import { IdentityDossier } from "@/components/profile/IdentityDossier";
import { SkillsMatrix } from "@/components/profile/SkillsMatrix";
import { AppShell } from "@/components/shell/AppShell";
import { buildPageMetadata } from "@/components/seo/metadata";
import { getAllRecords, getDirectoryCounts } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search/index";
import { getIdentityProfile, getSkillsMatrix } from "@/lib/profile";

export const metadata = buildPageMetadata({
  title: "About",
  path: "/about",
  description:
    "Identity dossier covering mission, strengths, and working style.",
});

export default async function AboutPage() {
  const [directoryCounts, allRecords, profile, skills] = await Promise.all([
    getDirectoryCounts(),
    getAllRecords(),
    getIdentityProfile(),
    getSkillsMatrix(),
  ]);

  const searchDocuments = buildSearchIndex(allRecords);

  return (
    <AppShell
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <div className="flex h-full flex-col gap-6 p-6">
        <IdentityDossier profile={profile} />
        <SkillsMatrix categories={skills} />
      </div>
    </AppShell>
  );
}

