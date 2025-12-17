import type { ReactNode } from "react";

import type { DirectoryId, DirectoryMeta } from "@/lib/directories";
import type { SearchDocument } from "@/lib/search/index";

import { CommandPalette } from "../command/CommandPalette";
import { DirectoryProvider } from "../providers/DirectoryProvider";
import { ShellLayout } from "./ShellLayout";
import type { BreadcrumbItem } from "./TopBar";

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
  const computedBreadcrumbs: BreadcrumbItem[] =
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
        <ShellLayout
          activeDirectory={activeDirectory}
          breadcrumbs={computedBreadcrumbs}
          directoryCounts={directoryCounts}
        >
          {children}
        </ShellLayout>
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
