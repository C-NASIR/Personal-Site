import type { ReactNode } from "react";

import {
  directoryMap,
  directoryRoute,
  type DirectoryId,
} from "@/lib/directories";

import { Sidebar } from "./Sidebar";
import { TopBar, type BreadcrumbItem } from "./TopBar";

type AppShellProps = {
  activeDirectory?: DirectoryId;
  directoryCounts: Record<DirectoryId, number>;
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};

export function AppShell({
  activeDirectory,
  directoryCounts,
  breadcrumbs,
  children,
}: AppShellProps) {
  const defaultBreadcrumbs: BreadcrumbItem[] =
    breadcrumbs ??
    (activeDirectory
      ? [
          {
            label: directoryMap[activeDirectory].label,
            href: directoryRoute(activeDirectory),
          },
        ]
      : [{ label: "Command Dashboard" }]);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-green-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,244,244,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,244,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <TopBar breadcrumbs={defaultBreadcrumbs} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeDirectory={activeDirectory} counts={directoryCounts} />
          <main className="flex-1 overflow-hidden border-l border-green-900/30 bg-black/40">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppShell;
