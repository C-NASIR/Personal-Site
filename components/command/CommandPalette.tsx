'use client';

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SearchDocument } from "@/lib/search/index";
import { directories } from "@/lib/directories";

import { CommandList } from "./CommandList";

type CommandPaletteProps = {
  documents: SearchDocument[];
};

type CommandType = "file" | "navigation";

type CommandItem = {
  id: string;
  label: string;
  route: string;
  type: CommandType;
  meta?: string;
  keywords: string[];
  document?: SearchDocument;
};

export type CommandResult = {
  command: CommandItem;
  score: number;
};

const NAVIGATION_COMMANDS: CommandItem[] = [
  {
    id: "nav-dashboard",
    label: "Go to Dashboard",
    route: "/dash",
    type: "navigation",
    meta: "Navigation",
    keywords: ["home", "dashboard", "main"],
  },
  ...directories.map((directory) => ({
    id: `nav-${directory.id}`,
    label: `Go to ${directory.label}`,
    route: `/files/${directory.id}`,
    type: "navigation" as const,
    meta: "Navigation",
    keywords: [
      "directory",
      directory.label,
      directory.id,
      directory.label.replace(/ Files| Reports| Logs| Credentials/gi, ""),
    ].map((keyword) => keyword.toLowerCase()),
  })),
  {
    id: "nav-search",
    label: "Search Everything",
    route: "/search",
    type: "navigation",
    meta: "Navigation",
    keywords: ["search", "find", "global"],
  },
];

export function CommandPalette({ documents }: CommandPaletteProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileCommands = useMemo(
    () =>
      documents.map<CommandItem>((document) => ({
        id: `file-${document.id}`,
        label: document.title,
        route: document.route,
        type: "file" as const,
        meta: `${document.directory.toUpperCase()} · ${document.classification}`,
        keywords: [
          document.id,
          document.slug,
          document.directory,
          document.classification,
          document.status,
          ...document.tags,
        ].map((keyword) => keyword.toLowerCase()),
        document,
      })),
    [documents],
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    const handleGlobalKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        handleOpen();
      } else if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        handleClose();
      }
    };

    const handleCustomOpen = () => handleOpen();

    window.addEventListener("keydown", handleGlobalKey);
    window.addEventListener("command-palette:open", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleGlobalKey);
      window.removeEventListener("command-palette:open", handleCustomOpen);
    };
  }, [handleClose, handleOpen, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timeout = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => {
        document.body.style.overflow = "";
        window.clearTimeout(timeout);
      };
    }

    document.body.style.overflow = "";
    return undefined;
  }, [isOpen]);

  const filteredCommands = useMemo(() => {
    const allCommands = [...NAVIGATION_COMMANDS, ...fileCommands];
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(Boolean);

    if (!terms.length) {
      return allCommands
        .slice(0, 8)
        .map((command, index) => ({ command, score: 100 - index }));
    }

    const results: CommandResult[] = [];

    for (const command of allCommands) {
      let matchesAllTerms = true;
      let score = 0;

      for (const term of terms) {
        const inLabel = command.label.toLowerCase().includes(term);
        const inKeywords = command.keywords.some((keyword) =>
          keyword.includes(term),
        );

        if (!inLabel && !inKeywords) {
          matchesAllTerms = false;
          break;
        }

        if (inLabel) {
          score += command.label.toLowerCase() === term ? 50 : 30;
        }
        if (inKeywords) {
          score += 15;
        }
      }

      if (matchesAllTerms) {
        results.push({ command, score });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }, [fileCommands, query]);

  const safeSelectedIndex =
    filteredCommands.length === 0
      ? -1
      : Math.min(selectedIndex, filteredCommands.length - 1);

  const handleExecute = (result: CommandResult) => {
    handleClose();
    router.push(result.command.route);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (filteredCommands.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((current) =>
        Math.min(current + 1, filteredCommands.length - 1),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      handleExecute(
        filteredCommands[safeSelectedIndex] ?? filteredCommands[0],
      );
    } else if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur">
      <div
        className="w-full max-w-2xl rounded-lg border border-green-900/50 bg-zinc-950 p-6 text-green-100 shadow-2xl"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.35em] text-green-500/80">
            Command Palette
          </p>
          <button
            aria-label="Close command palette"
            className="text-sm uppercase tracking-[0.3em] text-green-300/80 hover:text-green-50"
            type="button"
            onClick={handleClose}
          >
            ESC
          </button>
        </div>
        <input
          className="mt-4 w-full rounded border border-green-800/40 bg-black/40 px-3 py-2 text-sm tracking-normal text-green-100 placeholder:text-green-500/60 focus:border-green-400/60 focus:outline-none"
          placeholder="Jump to any dossier or page..."
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedIndex(0);
          }}
        />
        <CommandList
          commands={filteredCommands}
          selectedIndex={
            safeSelectedIndex >= 0 ? safeSelectedIndex : 0
          }
          onSelect={setSelectedIndex}
          onExecute={handleExecute}
          queryTerms={queryTerms}
        />
      </div>
    </div>
  );
}
