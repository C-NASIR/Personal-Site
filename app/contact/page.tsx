import { SecureComms } from "@/components/contact/SecureComms";
import { AppShell } from "@/components/shell/AppShell";
import { buildPageMetadata } from "@/components/seo/metadata";
import { getAllRecords, getDirectoryCounts } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search/index";

export const metadata = buildPageMetadata({
  title: "Contact",
  path: "/contact",
  description: "Secure communication channels to reach Xander Nova.",
});

export default async function ContactPage() {
  const [directoryCounts, allRecords] = await Promise.all([
    getDirectoryCounts(),
    getAllRecords(),
  ]);
  const searchDocuments = buildSearchIndex(allRecords);

  const contactLinks = [
    { label: "LinkedIn", href: "https://linkedin.com/in/xandernova" },
    { label: "GitHub", href: "https://github.com/xandernova" },
    { label: "Calendly", href: "https://calendly.com/xandernova/intro" },
  ];

  return (
    <AppShell
      directoryCounts={directoryCounts}
      searchDocuments={searchDocuments}
    >
      <div className="flex h-full items-start justify-center p-6">
        <SecureComms email="secure@xandernova.dev" links={contactLinks} />
      </div>
    </AppShell>
  );
}

