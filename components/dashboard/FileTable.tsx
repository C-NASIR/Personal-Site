'use client';

import clsx from "clsx";
import { useCallback, type KeyboardEvent } from "react";

import { clamp } from "@/lib/format";
import type { ContentRecord } from "@/lib/content/types";

export type SortKey = "title" | "classification" | "status" | "updated";
export type SortDirection = "asc" | "desc";

type FileTableProps = {
  files: ContentRecord[];
  sortKey: SortKey;
  sortDirection: SortDirection;
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  onSortChange: (key: SortKey) => void;
  onOpen: (file: ContentRecord) => void;
};

export function FileTable({
  files,
  sortKey,
  sortDirection,
  selectedIndex,
  onSelect,
  onSortChange,
  onOpen,
}: FileTableProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!files.length) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex =
          selectedIndex === null
            ? 0
            : clamp(selectedIndex + 1, 0, files.length - 1);
        onSelect(nextIndex);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex =
          selectedIndex === null
            ? 0
            : clamp(selectedIndex - 1, 0, files.length - 1);
        onSelect(nextIndex);
      } else if (event.key === "Enter" && selectedIndex !== null) {
        event.preventDefault();
        onOpen(files[selectedIndex]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        onSelect(null);
      }
    },
    [files, onOpen, onSelect, selectedIndex],
  );

  const handleSort = (key: SortKey) => {
    onSortChange(key);
  };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col rounded border border-green-900/40 bg-black/60"
      role="grid"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="File table"
    >
      <div className="grid grid-cols-[minmax(0,2.2fr)_minmax(0,1.1fr)_120px_120px] border-b border-green-900/30 text-[0.62rem] uppercase tracking-[0.35em] text-green-400/70">
        <HeaderCell
          label="Title"
          sortKey="title"
          activeKey={sortKey}
          direction={sortDirection}
          onClick={handleSort}
        />
        <HeaderCell
          label="Classification"
          sortKey="classification"
          activeKey={sortKey}
          direction={sortDirection}
          onClick={handleSort}
        />
        <HeaderCell
          label="Status"
          sortKey="status"
          activeKey={sortKey}
          direction={sortDirection}
          onClick={handleSort}
        />
        <HeaderCell
          label="Updated"
          sortKey="updated"
          activeKey={sortKey}
          direction={sortDirection}
          onClick={handleSort}
        />
      </div>

      <div className="flex-1 overflow-auto">
        {files.length === 0 ? (
          <p className="p-6 text-sm uppercase tracking-[0.3em] text-green-400/70">
            No files match the current filters
          </p>
        ) : (
          files.map((file, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                aria-selected={isSelected}
                className={clsx(
                  "grid cursor-pointer grid-cols-[minmax(0,2.2fr)_minmax(0,1.1fr)_120px_120px] border-b border-green-900/10 px-4 py-3 text-sm transition",
                  isSelected
                    ? "bg-green-500/10 text-green-50"
                    : "hover:bg-green-400/5",
                )}
                key={file.id}
                onClick={() => onSelect(index)}
                onDoubleClick={() => onOpen(file)}
                role="row"
              >
                <div className="flex flex-col">
                  <span className="font-semibold tracking-wide text-green-100">
                    {file.title}
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] text-green-400/70">
                    {file.id}
                  </span>
                </div>
                <div className="text-xs">
                  <Chip variant="classification">{file.classification}</Chip>
                </div>
                <div className="text-xs">
                  <Chip variant={file.status.toLowerCase() as ChipVariant}>
                    {file.status}
                  </Chip>
                </div>
                <div className="text-xs tracking-[0.2em] text-green-300/80">
                  {new Date(file.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "2-digit",
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

type ChipVariant = "classification" | "active" | "archived" | "draft";

type ChipProps = {
  variant: ChipVariant;
  children: React.ReactNode;
};

function Chip({ variant, children }: ChipProps) {
  const styles: Record<ChipVariant, string> = {
    classification: "border-green-400/40 bg-green-500/10 text-green-200",
    active: "border-emerald-500/50 bg-emerald-500/10 text-emerald-200",
    archived: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    draft: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-3 py-1 uppercase tracking-[0.3em]",
        styles[variant],
      )}
    >
      {children}
    </span>
  );
}

type HeaderCellProps = {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onClick: (key: SortKey) => void;
};

function HeaderCell({
  label,
  sortKey,
  activeKey,
  direction,
  onClick,
}: HeaderCellProps) {
  const isActive = activeKey === sortKey;
  const ariaSort: "none" | "ascending" | "descending" = isActive
    ? direction === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <div
      aria-sort={ariaSort}
      className="border-b border-green-900/40"
      role="columnheader"
    >
      <button
        className={clsx(
          "flex w-full items-center gap-2 px-3 py-3 text-left transition",
          isActive ? "text-green-100" : "hover:text-green-50",
        )}
        type="button"
        onClick={() => onClick(sortKey)}
      >
        {label}
        {isActive ? (
          <span aria-hidden className="text-green-400">
            {direction === "asc" ? "▲" : "▼"}
          </span>
        ) : null}
      </button>
    </div>
  );
}

export default FileTable;
