import { CredentialCard } from "@/components/profile/CredentialCard";
import { AppShell } from "@/components/shell/AppShell";
import { buildPageMetadata } from "@/components/seo/metadata";
import {
  getAllRecords,
  getDirectoryCounts,
  getDirectoryRecords,
} from "@/lib/content";
import { buildSearchIndex } from "@/lib/search/index";

export const metadata = buildPageMetadata({
  title: "Credentials",
  path: "/credentials",
  description: "Resume, trust grid, and references dossier overview.",
});

export default async function CredentialsPage() {
  const [directoryCounts, credentialRecords, allRecords] = await Promise.all([
    getDirectoryCounts(),
    getDirectoryRecords("credentials"),
    getAllRecords(),
  ]);

  const searchDocuments = buildSearchIndex(allRecords);

  return (
    <AppShell
      activeDirectory="credentials"
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <div className="flex h-full flex-col gap-6 p-6">
        <header>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-green-500/70">
            Credentials
          </p>
          <h1 className="text-3xl font-semibold text-green-50">
            Resume and verification dossiers.
          </h1>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {credentialRecords.map((record) => (
            <CredentialCard key={record.id} record={record} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

