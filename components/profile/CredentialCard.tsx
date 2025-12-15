import Link from "next/link";

import type { ContentRecord } from "@/lib/content/types";
import { formatDate } from "@/lib/format";

type CredentialCardProps = {
  record: ContentRecord;
};

export function CredentialCard({ record }: CredentialCardProps) {
  return (
    <article className="flex flex-col rounded border border-green-900/40 bg-black/60 p-4 text-sm text-green-100">
      <div className="flex items-center justify-between gap-3 border-b border-green-900/30 pb-3">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-green-500/70">
            {record.classification}
          </p>
          <h3 className="text-lg font-semibold text-green-50">{record.title}</h3>
        </div>
        <span className="rounded border border-green-800/40 px-2 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-green-200">
          {record.status}
        </span>
      </div>
      <p className="mt-3 text-green-200/90">{record.summary}</p>
      <dl className="mt-3 grid gap-1 text-[0.65rem] uppercase tracking-[0.3em] text-green-400/80">
        <div>
          <dt>Updated</dt>
          <dd className="text-green-100">
            {formatDate(record.updatedAt, {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </dd>
        </div>
        {record.tags.length ? (
          <div>
            <dt>Tags</dt>
            <dd className="flex flex-wrap gap-1 text-[0.6rem] normal-case tracking-[0.2em] text-green-200">
              {record.tags.map((tag) => (
                <span
                  className="rounded border border-green-800/40 px-2 py-0.5"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <Link
          className="rounded border border-green-700/40 px-3 py-2 uppercase tracking-[0.3em] text-green-200 hover:border-green-400"
          href={`/files/${record.directory}/${record.slug}`}
        >
          Open dossier
        </Link>
        {record.pdfUrl ? (
          <a
            className="rounded border border-green-500/60 px-3 py-2 uppercase tracking-[0.3em] text-green-50 hover:border-green-300"
            href={record.pdfUrl}
            target="_blank"
            rel="noreferrer"
          >
            Download PDF
          </a>
        ) : null}
      </div>
    </article>
  );
}

export default CredentialCard;

