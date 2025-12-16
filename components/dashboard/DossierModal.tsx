"use client";

import { useEffect } from "react";
import { MDXRemote } from "next-mdx-remote";

import type { ContentRecord } from "@/lib/content/types";

import { mdxComponents } from "../dossier/mdxComponents";

type DossierModalProps = {
  record: ContentRecord | null;
  onClose: () => void;
};

export function DossierModal({ record, onClose }: DossierModalProps) {
  useEffect(() => {
    if (!record) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [record, onClose]);

  if (!record) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10 backdrop-blur-sm"
    >
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-green-900/50 bg-zinc-950 shadow-2xl">
        <button
          aria-label="Close dossier"
          className="absolute right-4 top-4 text-green-200 transition hover:text-green-50 cursor-pointer"
          type="button"
          onClick={onClose}
        >
          ✕
        </button>

        <header className="border-b border-green-900/40 bg-black/40 px-6 py-4 text-xs uppercase tracking-[0.35em] text-green-400/80">
          <p>{record.classification}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal text-green-50">
            {record.title}
          </h2>
          <p className="text-[0.7rem] tracking-[0.3em] text-green-300/80">
            {record.id} · {record.status}
          </p>
        </header>

        <div className="flex-1 overflow-auto px-6 py-6 text-xl leading-relaxed text-green-100/90">
          <MDXRemote {...record.mdx} components={mdxComponents} />
        </div>
      </div>
    </div>
  );
}

export default DossierModal;
