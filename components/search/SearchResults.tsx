'use client';

import clsx from "clsx";
import type { KeyboardEvent } from "react";

import type { SearchResultItem } from "./SearchPage";

type SearchResultsProps = {
  results: SearchResultItem[];
  terms: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onOpen: () => void;
};

export function SearchResults({
  results,
  terms,
  selectedIndex,
  onSelect,
  onOpen,
}: SearchResultsProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const nextIndex =
        selectedIndex === null
          ? 0
          : Math.min(selectedIndex + 1, results.length - 1);
      onSelect(nextIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const nextIndex =
        selectedIndex === null
          ? 0
          : Math.max(selectedIndex - 1, 0);
      onSelect(nextIndex);
    } else if (event.key === "Enter") {
      event.preventDefault();
      onOpen();
    } else if (event.key === "Escape") {
      event.preventDefault();
      onSelect(0);
    }
  };

  return (
    <div
      className="flex min-h-0 flex-1 flex-col rounded border border-green-900/40 bg-black/60"
      role="listbox"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Search results list"
    >
      {results.length === 0 ? (
        <p className="p-6 text-xs uppercase tracking-[0.3em] text-green-500/70">
          No results. Adjust filters or try a different query.
        </p>
      ) : (
        <div className="flex-1 overflow-auto divide-y divide-green-900/30">
          {results.map((result, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                aria-selected={isSelected}
                className={clsx(
                  "cursor-pointer px-4 py-4 transition",
                  isSelected
                    ? "bg-green-500/10 text-green-50"
                    : "hover:bg-green-400/5",
                )}
                key={result.document.id}
                onClick={() => onSelect(index)}
                onDoubleClick={onOpen}
                role="option"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-green-500/70">
                      {result.document.directory.toUpperCase()} ·{" "}
                      {result.document.classification}
                    </p>
                    <h3 className="text-lg font-semibold text-green-50">
                      {highlightText(result.document.title, terms)}
                    </h3>
                  </div>
                  <span className="rounded border border-green-800/40 px-2 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-green-200">
                    {result.document.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-green-200/90">
                  {highlightText(result.snippet, terms)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function highlightText(text: string, terms: string[]) {
  if (!terms.length) {
    return text;
  }

  const safeTerms = terms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const pattern = new RegExp(`(${safeTerms})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    pattern.lastIndex = 0;
    return pattern.test(part) ? (
      <mark
        className="bg-green-500/20 text-green-100"
        key={`${part}-${index}`}
      >
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    );
  });
}

export default SearchResults;
