'use client';

import { useState } from "react";

import { formatDate } from "@/lib/format";
import type { FileRecord } from "@/lib/mockData";

type InspectorPanelProps = {
  file?: FileRecord;
  onOpen: (file: FileRecord) => void;
};

export function InspectorPanel({ file, onOpen }: InspectorPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!file) return;

    try {
      await navigator.clipboard.writeText(file.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (!file) {
    return (
      <aside className="rounded border border-green-900/40 bg-black/50 p-6 text-sm text-green-200/80">
        <p className="text-xs uppercase tracking-[0.4em] text-green-500/80">
          Inspector
        </p>
        <p className="mt-4 leading-relaxed">
          Select a file to review metadata, tags, and the preview stream. Double
          click a row or press Enter to open the dossier.
        </p>
      </aside>
    );
  }

  return (
    <aside className="flex min-h-0 flex-col rounded border border-green-900/40 bg-black/50 p-6 text-sm text-green-100">
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-green-500/80">
          Inspector
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-green-50">
          {file.title}
        </h2>
        <p className="mt-2 text-xs uppercase tracking-[0.4em] text-green-300/80">
          {file.classification}
        </p>
      </div>

      <dl className="mt-6 grid gap-4 text-xs uppercase tracking-[0.35em] text-green-300/80">
        <div className="space-y-1 rounded border border-green-900/40 bg-black/40 px-3 py-2">
          <dt>Owner</dt>
          <dd className="text-green-100">{file.owner}</dd>
        </div>
        <div className="space-y-1 rounded border border-green-900/40 bg-black/40 px-3 py-2">
          <dt>Status</dt>
          <dd className="text-green-100">{file.status}</dd>
        </div>
        <div className="space-y-1 rounded border border-green-900/40 bg-black/40 px-3 py-2">
          <dt>Updated</dt>
          <dd className="text-green-100">
            {formatDate(file.updated, { month: "short", day: "2-digit" })}
          </dd>
        </div>
        <div className="space-y-1 rounded border border-green-900/40 bg-black/40 px-3 py-2">
          <dt>Tags</dt>
          <dd className="flex flex-wrap gap-2 text-[0.6rem] normal-case tracking-[0.2em] text-green-200">
            {file.tags.map((tag) => (
              <span
                className="rounded border border-green-800/40 px-2 py-1"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="mt-6 space-y-2 text-xs uppercase tracking-[0.4em] text-green-500/80">
        <p>Preview</p>
        <div className="rounded border border-green-900/40 bg-black/60 p-4">
          <p className="text-[0.75rem] tracking-wide text-green-200/90">
            {file.summary}
          </p>
          <div className="mt-4 space-y-2">
            {[92, 65, 80, 58, 72].map((width) => (
              <div
                className="h-3 rounded bg-green-500/10"
                key={width}
                aria-hidden
              >
                <div
                  className="h-full rounded bg-green-300/40"
                  style={{ width: `${width}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 text-[0.65rem] uppercase tracking-[0.35em]">
        <button
          className="rounded border border-green-500/60 bg-green-500/10 px-3 py-2 text-green-50 transition hover:bg-green-500/20"
          type="button"
          onClick={() => onOpen(file)}
        >
          Open dossier
        </button>
        <button
          className="rounded border border-green-800/40 px-3 py-2 text-green-200 transition hover:border-green-500/40"
          type="button"
          onClick={handleCopy}
        >
          {copied ? "Copied ID" : "Copy file id"}
        </button>
      </div>
    </aside>
  );
}

export default InspectorPanel;

