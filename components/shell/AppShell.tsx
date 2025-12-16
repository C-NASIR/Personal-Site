import type { ReactNode } from "react";

import type { DirectoryId, DirectoryMeta } from "@/lib/directories";
import type { SearchDocument } from "@/lib/search/index";

import { CommandPalette } from "../command/CommandPalette";
import { DirectoryProvider } from "../providers/DirectoryProvider";
import { Sidebar } from "./Sidebar";
import { TopBar, type BreadcrumbItem } from "./TopBar";

type AppShellProps = {
  directories: DirectoryMeta[];
  activeDirectory?: DirectoryId;
  directoryCounts: Record<DirectoryId, number>;
  searchDocuments: SearchDocument[];
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showCommandPalette?: boolean;
};

export function AppShell({
  directories,
  activeDirectory,
  directoryCounts,
  searchDocuments,
  breadcrumbs,
  children,
  showCommandPalette = true,
}: AppShellProps) {
  const directoryMap = buildDirectoryMap(directories);
  const activeDirectoryMeta = activeDirectory
    ? directoryMap[activeDirectory]
    : undefined;
  const defaultBreadcrumbs: BreadcrumbItem[] =
    breadcrumbs ??
    (activeDirectoryMeta
      ? [
          {
            label: activeDirectoryMeta.label,
            href: activeDirectoryMeta.route,
          },
        ]
      : [{ label: "Command Dashboard" }]);

  return (
    <DirectoryProvider directories={directories}>
      <div className="relative min-h-screen bg-zinc-950 text-green-100 lg:h-screen">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(244,244,244,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,244,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 flex min-h-screen flex-col lg:h-screen">
          <a className="skip-link" href="#main-content">
            Skip to main content
          </a>
          <TopBar breadcrumbs={defaultBreadcrumbs} />
          <div className="flex min-h-0 flex-1 overflow-hidden">
            <Sidebar
              activeDirectory={activeDirectory}
              counts={directoryCounts}
            />
            <main
              className="flex-1 min-h-0 overflow-y-auto border-l border-green-900/30 bg-black/40"
              id="main-content"
            >
              {children}
            </main>
          </div>
        </div>
        {showCommandPalette ? (
          <CommandPalette documents={searchDocuments} />
        ) : null}
      </div>
    </DirectoryProvider>
  );
}

export default AppShell;

function buildDirectoryMap(directories: DirectoryMeta[]) {
  return directories.reduce<Record<string, DirectoryMeta>>((acc, directory) => {
    acc[directory.id] = directory;
    return acc;
  }, {});
}
