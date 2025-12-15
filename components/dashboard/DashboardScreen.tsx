'use client';

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { directoryMap, type DirectoryId } from "@/lib/directories";
import type { ContentRecord } from "@/lib/content/types";

import { FileTable, type SortDirection, type SortKey } from "./FileTable";
import { InspectorPanel } from "./InspectorPanel";

type DashboardScreenProps = {
  directory: DirectoryId;
  records: ContentRecord[];
};

const DEFAULT_SORT_KEY: SortKey = "updated";
const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

export function DashboardScreen({ directory, records }: DashboardScreenProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(DEFAULT_SORT_KEY);
  const [sortDirection, setSortDirection] =
    useState<SortDirection>(DEFAULT_SORT_DIRECTION);
  const [selectedId, setSelectedId] = useState<string | null>(
    () => records[0]?.id ?? null,
  );

  const filteredFiles = useMemo(() => {
    if (!query.trim()) {
      return records;
    }
    const needle = query.toLowerCase();
    return records.filter(
      (file) =>
        file.id.toLowerCase().includes(needle) ||
        file.title.toLowerCase().includes(needle) ||
        file.summary.toLowerCase().includes(needle) ||
        file.tags.some((tag) => tag.toLowerCase().includes(needle)),
    );
  }, [records, query]);

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
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }

      return comparison * directionFactor;
    });

    return next;
  }, [filteredFiles, sortDirection, sortKey]);

  const selectedFileFromState = selectedId
    ? sortedFiles.find((file) => file.id === selectedId)
    : undefined;
  const selectedFile = selectedFileFromState ?? sortedFiles[0];
  const safeSelectedIndex = selectedFile
    ? sortedFiles.findIndex((file) => file.id === selectedFile.id)
    : null;

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
    (file: ContentRecord) => {
      router.push(`/files/${file.directory}/${file.slug}`);
    },
    [router],
  );

  const info = directoryMap[directory];

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
            setSelectedId(
              index === null ? null : sortedFiles[index]?.id ?? null,
            )
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
