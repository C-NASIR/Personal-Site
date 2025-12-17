import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";

import type { ContentRecord } from "@/lib/content/types";
import type { DirectoryMeta } from "@/lib/directories";
import { formatDate } from "@/lib/format";

import { mdxComponents } from "./mdxComponents";

type DossierReaderProps = {
  file: ContentRecord;
  directory: DirectoryMeta;
};

export function DossierReader({ file, directory }: DossierReaderProps) {
  return (
    <section className="min-h-full bg-[#101010] pb-16 text-green-50">
      <div className="mx-auto w-full max-w-5xl px-6 pt-10 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            className="text-xs uppercase tracking-[0.35em] text-green-400/80 transition hover:text-green-50"
            href={`/files/${directory.id}/${file.slug}`}
          >
            ← Back to dossier
          </Link>
          {file.pdfUrl ? (
            <a
              className="rounded-full border border-green-500/60 bg-[#171717] px-4 py-2 text-xs uppercase tracking-[0.35em] text-green-200 transition hover:border-green-300 hover:text-green-50"
              href={file.pdfUrl}
              target="_blank"
              rel="noreferrer"
            >
              Download PDF
            </a>
          ) : null}
        </div>

        <header className="mt-6 space-y-4 rounded-3xl border border-green-900/40 bg-[#1c1c1c] px-8 py-10 shadow-2xl shadow-black/30">
          <p className="text-xs uppercase tracking-[0.4em] text-green-400/80">
            {file.classification}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-green-50">
            {file.title}
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-green-300/80">
            {file.id} · {directory.label}
          </p>
          <p className="max-w-3xl text-lg leading-relaxed text-green-100/90">
            {file.summary}
          </p>
          <div className="mt-8 grid gap-4 text-sm uppercase tracking-[0.3em] text-green-400/70 sm:grid-cols-2 lg:grid-cols-4">
            <Metadata label="Owner">{file.owner ?? "Classified"}</Metadata>
            <Metadata label="Status">{file.status}</Metadata>
            <Metadata label="Updated">
              {formatDate(file.updatedAt, {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </Metadata>
            <Metadata label="Tags">
              <span className="flex flex-wrap gap-2 text-[0.6rem] normal-case tracking-[0.2em] text-green-200">
                {file.tags.map((tag) => (
                  <span
                    className="rounded-full border border-green-900/40 px-3 py-1"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </Metadata>
          </div>
        </header>

        <article className="mt-10 rounded-3xl border border-green-900/40 bg-[#212121] p-8 text-[1.05rem] leading-relaxed text-green-100 shadow-inner shadow-black/40 md:p-10">
          <MDXRemote source={file.body} components={mdxComponents} />
        </article>
      </div>
    </section>
  );
}

type MetadataProps = {
  label: string;
  children: ReactNode;
};

function Metadata({ label, children }: MetadataProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-green-900/30 bg-[#171717] px-4 py-3 text-green-100">
      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-green-500/70">
        {label}
      </p>
      <div className="text-sm normal-case tracking-normal text-green-50">
        {children}
      </div>
    </div>
  );
}

export default DossierReader;
