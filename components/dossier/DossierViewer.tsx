import Link from "next/link";
import type { ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

import type { ContentRecord } from "@/lib/content/types";
import { formatDate } from "@/lib/format";
import { directoryRoute, type DirectoryMeta } from "@/lib/directories";
import { mdxComponents } from "./mdxComponents";

type DossierViewerProps = {
  file: ContentRecord;
  directory: DirectoryMeta;
};

export function DossierViewer({ file, directory }: DossierViewerProps) {
  return (
    <section className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-green-900/40 pb-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-green-500/70">
            {file.classification}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-green-50">
            {file.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-green-200/90">
            {file.summary}
          </p>
        </div>
        <Link
          className="text-[0.65rem] uppercase tracking-[0.35em] text-green-300/80 underline decoration-green-500/60 underline-offset-4 transition hover:text-green-50"
          href={directoryRoute(directory.id)}
        >
          ← Back to {directory.label}
        </Link>
      </div>

      <div className="grid gap-4 text-xs uppercase tracking-[0.35em] text-green-400/70 sm:grid-cols-2 lg:grid-cols-4">
        <Metadata label="File ID">{file.id}</Metadata>
        <Metadata label="Owner">{file.owner}</Metadata>
        <Metadata label="Status">{file.status}</Metadata>
        <Metadata label="Updated">
          {formatDate(file.updatedAt, {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </Metadata>
        {file.role ? <Metadata label="Role">{file.role}</Metadata> : null}
        {file.timeframe ? (
          <Metadata label="Timeframe">{file.timeframe}</Metadata>
        ) : null}
        {file.stack?.length ? (
          <Metadata label="Stack">
            <span className="flex flex-wrap gap-2 text-[0.6rem] normal-case tracking-[0.2em] text-green-200">
              {file.stack.map((tag) => (
                <span
                  className="rounded border border-green-800/40 px-2 py-1"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </span>
          </Metadata>
        ) : null}
        <Metadata label="Tags">
          <span className="flex flex-wrap gap-2 text-[0.6rem] normal-case tracking-[0.2em] text-green-200">
            {file.tags.map((tag) => (
              <span
                className="rounded border border-green-800/40 px-2 py-1"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </span>
        </Metadata>
        {file.links?.length ? (
          <Metadata label="Links">
            <ul className="space-y-1 text-[0.6rem] normal-case tracking-[0.2em] text-green-200">
              {file.links.map((link) => (
                <li key={link.href}>
                  <a
                    className="text-green-300 underline decoration-green-500/60 underline-offset-4 hover:text-green-50"
                    href={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Metadata>
        ) : null}
      </div>

      <article className="flex-1 overflow-auto rounded border border-green-900/40 bg-black/60 p-6 text-sm leading-relaxed text-green-100/90">
        <MDXRemote source={file.body} components={mdxComponents} />
      </article>
    </section>
  );
}

type MetadataProps = {
  label: string;
  children: ReactNode;
};

function Metadata({ label, children }: MetadataProps) {
  return (
    <div className="space-y-1 rounded border border-green-900/40 bg-black/50 px-3 py-2 text-green-100">
      <p className="text-[0.55rem] uppercase tracking-[0.4em] text-green-500/70">
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}

export default DossierViewer;
