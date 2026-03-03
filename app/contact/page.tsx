import { SecureComms } from "@/components/contact/SecureComms";
import { AppShell } from "@/components/shell/AppShell";
import { buildPageMetadata } from "@/components/seo/metadata";
import { getAllRecords, getDirectoryCounts } from "@/lib/content";
import { getDirectoryMetas } from "@/lib/directories";
import { buildSearchIndex } from "@/lib/search/index";

export const metadata = buildPageMetadata({
  title: "Contact",
  path: "/contact",
  description: "Secure communication channels to reach Xander Nova.",
});

export default async function ContactPage() {
  const [directoryCounts, allRecords, directories] = await Promise.all([
    getDirectoryCounts(),
    getAllRecords(),
    getDirectoryMetas(),
  ]);
  const searchDocuments = buildSearchIndex(allRecords);

  const contactLinks = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/cnasir2/" },
    { label: "GitHub", href: "https://github.com/C-NASIR" },
  ];

  return (
    <AppShell
      directories={directories}
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <div className="flex h-full items-start justify-center p-6">
        <SecureComms email="secure@xandernova.dev" links={contactLinks} />
      </div>
    </AppShell>
  );
}
