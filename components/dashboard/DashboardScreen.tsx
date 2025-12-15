'use client';

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  directoryMap,
  filesByDirectory,
  type DirectoryId,
  type FileRecord,
} from "@/lib/mockData";

import { FileTable, type SortDirection, type SortKey } from "./FileTable";
import { InspectorPanel } from "./InspectorPanel";

type DashboardScreenProps = {
  directory: DirectoryId;
};

const DEFAULT_SORT_KEY: SortKey = "updated";
const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

export function DashboardScreen({ directory }: DashboardScreenProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(DEFAULT_SORT_KEY);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(DEFAULT_SORT_DIRECTION);
  const [selectionByDirectory, setSelectionByDirectory] = useState<
    Record<DirectoryId, string | null>
  >(() => {
    const initial: Record<DirectoryId, string | null> = {
      case: filesByDirectory.case[0]?.id ?? null,
      intel: filesByDirectory.intel[0]?.id ?? null,
      logs: filesByDirectory.logs[0]?.id ?? null,
      credentials: filesByDirectory.credentials[0]?.id ?? null,
    };
    return initial;
  });

  const activeDirectory = directory;
  const directoryFiles = filesByDirectory[activeDirectory];

  const filteredFiles = useMemo(() => {
    if (!query.trim()) {
      return directoryFiles;
    }
    const needle = query.toLowerCase();
    return directoryFiles.filter(
      (file) =>
        file.title.toLowerCase().includes(needle) ||
        file.summary.toLowerCase().includes(needle) ||
        file.tags.some((tag) => tag.toLowerCase().includes(needle)),
    );
  }, [directoryFiles, query]);

  const sortedFiles = useMemo(() => {
    const next = [...filteredFiles];
    const directionFactor = sortDirection === "asc" ? 1 : -1;

    next.sort((a, b) => {
      let comparison = 0;

      switch (sortKey) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "classification":
          comparison = a.classification.localeCompare(b.classification);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "updated":
        default:
          comparison =
            new Date(a.updated).getTime() - new Date(b.updated).getTime();
          break;
      }

      return comparison * directionFactor;
    });

    return next;
  }, [filteredFiles, sortDirection, sortKey]);

  const selectedFileId = selectionByDirectory[activeDirectory];
  const selectedIndex = selectedFileId
    ? sortedFiles.findIndex((file) => file.id === selectedFileId)
    : null;
  const safeSelectedIndex =
    selectedIndex !== null && selectedIndex >= 0 ? selectedIndex : null;
  const selectedFile =
    safeSelectedIndex !== null ? sortedFiles[safeSelectedIndex] : undefined;

  const handleSortChange = useCallback(
    (key: SortKey) => {
      setSortDirection((previousDirection) => {
        if (sortKey !== key) {
          setSortKey(key);
          return key === "title" ? "asc" : DEFAULT_SORT_DIRECTION;
        }
        return previousDirection === "asc" ? "desc" : "asc";
      });
    },
    [sortKey],
  );

  const handleOpen = useCallback(
    (file: FileRecord) => {
      router.push(`/files/${file.directory}/${file.slug}`);
    },
    [router],
  );

  const info = directoryMap[activeDirectory];

  return (
    <section className="flex h-full flex-col gap-6 p-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.4em] text-green-500/70">
              Directory
            </p>
            <h1 className="text-3xl font-semibold text-green-50">
              {info.label}
            </h1>
          </div>
          <label
            className="flex w-full max-w-sm flex-col text-xs uppercase tracking-[0.3em] text-green-400/80"
            htmlFor="dashboard-search"
          >
            Search
            <input
              autoComplete="off"
              className="mt-2 rounded border border-green-800/40 bg-black/40 px-3 py-2 text-sm tracking-normal text-green-100 placeholder:text-green-500/60 focus:border-green-400/60 focus:outline-none"
              id="dashboard-search"
              placeholder="Search title, tag, or summary"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <p className="text-sm text-green-200/80">{info.description}</p>
        <p className="text-xs uppercase tracking-[0.3em] text-green-500/70">
          {sortedFiles.length} result
          {sortedFiles.length === 1 ? "" : "s"} · Double click or press Enter to
          open
        </p>
      </div>

      <div className="grid flex-1 grid-rows-2 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] lg:grid-rows-1">
        <FileTable
          files={sortedFiles}
          sortKey={sortKey}
          sortDirection={sortDirection}
          selectedIndex={safeSelectedIndex}
          onSelect={(index) =>
            setSelectionByDirectory((previous) => ({
              ...previous,
              [activeDirectory]:
                index === null ? null : sortedFiles[index]?.id ?? null,
            }))
          }
          onSortChange={handleSortChange}
          onOpen={handleOpen}
        />
        <InspectorPanel file={selectedFile} onOpen={handleOpen} />
      </div>
    </section>
  );
}

export default DashboardScreen;
