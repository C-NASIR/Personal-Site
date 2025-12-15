import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { AppShell } from "@/components/shell/AppShell";
import {
  getDirectoryCounts,
  getDirectoryRecords,
} from "@/lib/content";

export default async function DashboardPage() {
  const [directoryCounts, records] = await Promise.all([
    getDirectoryCounts(),
    getDirectoryRecords("case"),
  ]);

  return (
    <AppShell activeDirectory="case" directoryCounts={directoryCounts}>
      <DashboardScreen
        key="case"
        directory="case"
        records={records}
      />
    </AppShell>
  );
}
