'use client';

import clsx from "clsx";

import type { CommandResult } from "./CommandPalette";

type CommandListProps = {
  commands: CommandResult[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onExecute: (command: CommandResult) => void;
  queryTerms: string[];
};

export function CommandList({
  commands,
  selectedIndex,
  onSelect,
  onExecute,
  queryTerms,
}: CommandListProps) {
  return (
    <div className="mt-4 max-h-80 overflow-auto rounded border border-green-900/40">
      {commands.length === 0 ? (
        <p className="p-4 text-xs uppercase tracking-[0.3em] text-green-500/70">
          Nothing found.
        </p>
      ) : (
        commands.map((result, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              aria-selected={isSelected}
              className={clsx(
                "flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition",
                isSelected
                  ? "bg-green-500/20 text-green-50"
                  : "hover:bg-green-500/10",
              )}
              key={result.command.id}
              role="option"
              type="button"
              onClick={() => onExecute(result)}
              onMouseEnter={() => onSelect(index)}
            >
              <div>
                <p className="font-semibold">
                  {highlightText(result.command.label, queryTerms)}
                </p>
                {result.command.meta ? (
                  <p className="text-xs uppercase tracking-[0.3em] text-green-300/80">
                    {result.command.meta}
                  </p>
                ) : null}
              </div>
              <span className="text-[0.6rem] uppercase tracking-[0.3em] text-green-200">
                {result.command.type === "file" ? "OPEN" : "GO"}
              </span>
            </button>
          );
        })
      )}
    </div>
  );
}

function highlightText(text: string, terms: string[]) {
  if (!terms.length) return text;

  const safeTerms = terms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");

  if (!safeTerms.length) return text;

  const pattern = new RegExp(`(${safeTerms})`, "gi");
  return text.split(pattern).map((part, index) => {
    pattern.lastIndex = 0;
    return pattern.test(part) ? (
      <mark className="bg-green-300/30 text-green-900" key={`${part}-${index}`}>
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    );
  });
}

export default CommandList;
