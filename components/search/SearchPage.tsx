'use client';
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { formatDate } from "@/lib/format";
import type { DirectoryId } from "@/lib/directories";
import type { SearchDocument } from "@/lib/search/index";

import { SearchResults } from "./SearchResults";
import { useDirectoryMetadata } from "../providers/DirectoryProvider";

type SearchPageProps = {
  documents: SearchDocument[];
};

export type SearchResultItem = {
  document: SearchDocument;
  score: number;
  snippet: string;
};

type ClassificationFilter =
  | "all"
  | "UNCLASSIFIED"
  | "CONFIDENTIAL"
  | "SECRET"
  | "TOP SECRET";

type StatusFilter = "all" | "ACTIVE" | "ARCHIVED" | "DRAFT";

type FilterState = {
  directory: DirectoryId | "all";
  classification: ClassificationFilter;
  status: StatusFilter;
};

const CLASSIFICATION_OPTIONS: FilterOption<ClassificationFilter>[] = [
  { label: "All", value: "all" },
  { label: "UNCLASSIFIED", value: "UNCLASSIFIED" },
  { label: "CONFIDENTIAL", value: "CONFIDENTIAL" },
  { label: "SECRET", value: "SECRET" },
  { label: "TOP SECRET", value: "TOP SECRET" },
];

const STATUS_OPTIONS: FilterOption<StatusFilter>[] = [
  { label: "All", value: "all" },
  { label: "ACTIVE", value: "ACTIVE" },
  { label: "ARCHIVED", value: "ARCHIVED" },
  { label: "DRAFT", value: "DRAFT" },
];

export function SearchPage({ documents }: SearchPageProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { directories } = useDirectoryMetadata();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    directory: "all",
    classification: "all",
    status: "all",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const terms = useMemo(
    () =>
      query
        .toLowerCase()
        .split(/\s+/)
        .map((term) => term.trim())
        .filter(Boolean),
    [query],
  );

  const results = useMemo(
    () => computeSearchResults(documents, terms, filters),
    [documents, terms, filters],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const derivedIndex = useMemo(() => {
    if (!results.length) return -1;
    const explicitIndex = results.findIndex(
      (result) => result.document.id === selectedId,
    );
    if (explicitIndex >= 0) return explicitIndex;
    return 0;
  }, [results, selectedId]);

  const selectedResult =
    derivedIndex >= 0 ? results[derivedIndex] : undefined;

  const handleExecute = () => {
    const target = selectedResult ?? results[0];
    if (target) {
      router.push(target.document.route);
    }
  };

  const directoryOptions = useMemo(
    () => [
      { label: "All", value: "all" as const },
      ...directories.map((directory) => ({
        label: directory.label,
        value: directory.id as DirectoryId,
      })),
    ],
    [directories],
  );

  const directorySummary =
    directories.length > 0
      ? directories.map((directory) => directory.label).join(", ")
      : "the available directories";

  return (
    <section className="flex h-full flex-col gap-6 p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label
            className="flex w-full max-w-md flex-col text-xs uppercase tracking-[0.3em] text-green-400/80"
            htmlFor="global-search-input"
          >
            Global search
            <input
              autoComplete="off"
              className="mt-2 rounded border border-green-800/40 bg-black/40 px-3 py-2 text-sm tracking-normal text-green-100 placeholder:text-green-500/60 focus:border-green-400/60 focus:outline-none"
              id="global-search-input"
              placeholder="Search dossiers, intel, logs..."
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedId(null);
              }}
            />
          </label>
          <p className="text-xs uppercase tracking-[0.4em] text-green-500/70">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-green-400/80">
          <FilterSelect<DirectoryId | "all">
            id="directory-filter"
            label="Directory"
            value={filters.directory}
            onChange={(value) => {
              setFilters((prev) => ({ ...prev, directory: value }));
              setSelectedId(null);
            }}
            options={directoryOptions}
          />
          <FilterSelect<ClassificationFilter>
            id="classification-filter"
            label="Classification"
            value={filters.classification}
            onChange={(value) => {
              setFilters((prev) => ({ ...prev, classification: value }));
              setSelectedId(null);
            }}
            options={CLASSIFICATION_OPTIONS}
          />
          <FilterSelect<StatusFilter>
            id="status-filter"
            label="Status"
            value={filters.status}
            onChange={(value) => {
              setFilters((prev) => ({ ...prev, status: value }));
              setSelectedId(null);
            }}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <SearchResults
          results={results}
          terms={terms}
          selectedIndex={derivedIndex >= 0 ? derivedIndex : 0}
          onSelect={(index) =>
            setSelectedId(results[index]?.document.id ?? null)
          }
          onOpen={handleExecute}
        />
        <aside className="rounded border border-green-900/40 bg-black/50 p-6 text-sm text-green-100">
          {selectedResult ? (
            <SearchPreview result={selectedResult} />
          ) : (
            <p className="text-xs uppercase tracking-[0.3em] text-green-500/70">
              Start typing to explore {directorySummary}.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}

type FilterOption<T> = {
  label: string;
  value: T;
};

type FilterSelectProps<T extends string> = {
  id: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: FilterOption<T>[];
};

function FilterSelect<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: FilterSelectProps<T>) {
  return (
    <label className="flex flex-col gap-2">
      {label}
      <select
        className="rounded border border-green-800/40 bg-black/40 px-3 py-2 text-sm normal-case text-green-100 focus:border-green-400/60 focus:outline-none"
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option className="bg-zinc-950" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SearchPreview({ result }: { result: SearchResultItem }) {
  const { document } = result;

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.35em] text-green-500/80">
          {document.directory.toUpperCase()} · {document.classification}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-green-50">
          {document.title}
        </h2>
        <p className="mt-2 text-sm text-green-200/90">{document.summary}</p>
      </div>

      <dl className="grid gap-3 text-xs uppercase tracking-[0.3em] text-green-400/70">
        <Metadata label="Status">{document.status}</Metadata>
        <Metadata label="Updated">
          {formatDate(document.updatedAt, {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </Metadata>
        {document.owner ? <Metadata label="Owner">{document.owner}</Metadata> : null}
      </dl>

      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.35em] text-green-500/70">
          Tags
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[0.6rem] normal-case tracking-[0.2em] text-green-200">
          {document.tags.map((tag) => (
            <span
              className="rounded border border-green-900/40 px-2 py-1"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-auto text-xs uppercase tracking-[0.3em] text-green-500/70">
        Press Enter to open
      </p>
    </div>
  );
}

function Metadata({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded border border-green-900/40 bg-black/40 px-3 py-2 text-green-100">
      <p className="text-[0.55rem] uppercase tracking-[0.3em] text-green-500/70">
        {label}
      </p>
      <p className="text-sm normal-case tracking-normal">{children}</p>
    </div>
  );
}

function computeSearchResults(
  documents: SearchDocument[],
  terms: string[],
  filters: FilterState,
): SearchResultItem[] {
  const filteredDocs = documents.filter((doc) => {
    if (filters.directory !== "all" && doc.directory !== filters.directory) {
      return false;
    }
    if (
      filters.classification !== "all" &&
      doc.classification !== filters.classification
    ) {
      return false;
    }
    if (filters.status !== "all" && doc.status !== filters.status) {
      return false;
    }
    return true;
  });

  if (!terms.length) {
    return filteredDocs
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .map((doc) => ({
        document: doc,
        score: 1,
        snippet: doc.preview,
      }));
  }

  const results: SearchResultItem[] = [];

  for (const doc of filteredDocs) {
    let score = 0;
    let matchesAllTerms = true;

    for (const term of terms) {
      const inTitle = doc.searchable.title.includes(term);
      const inId = doc.searchable.idSlug.includes(term);
      const inTags = doc.searchable.tags.includes(term);
      const inSummary = doc.searchable.summary.includes(term);
      const inBody = doc.searchable.body.includes(term);

      if (!inTitle && !inId && !inTags && !inSummary && !inBody) {
        matchesAllTerms = false;
        break;
      }

      if (inTitle) {
        score += doc.title.toLowerCase() === term ? 40 : 20;
      }
      if (inId) {
        score += 15;
      }
      if (inTags) {
        score += 10;
      }
      if (inSummary) {
        score += 8;
      }
      if (inBody) {
        score += 4;
      }
    }

    if (!matchesAllTerms) continue;

    results.push({
      document: doc,
      score,
      snippet: doc.preview,
    });
  }

  return results.sort((a, b) => b.score - a.score);
}
