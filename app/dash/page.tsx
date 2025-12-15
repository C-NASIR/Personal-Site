import { DashboardScreen } from "@/components/dashboard/DashboardScreen";
import { AppShell } from "@/components/shell/AppShell";

export default function DashboardPage() {
  return (
    <AppShell activeDirectory="case">
      <DashboardScreen directory="case" />
    </AppShell>
  );
}
