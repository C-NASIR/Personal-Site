'use client';

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 py-16 text-center font-mono text-green-100">
      <p className="text-[0.65rem] uppercase tracking-[0.5em] text-green-500/70">
        System fault detected
      </p>
      <h1 className="mt-4 text-4xl font-semibold text-green-50">
        The console lost sync.
      </h1>
      <p className="mt-3 max-w-lg text-sm text-green-200/80">
        Something unexpected happened while rendering this dossier. You can retry
        the request or jump back to the dashboard.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.35em]">
        <button
          className="rounded border border-green-500/60 px-4 py-2 text-green-50 hover:border-green-300"
          type="button"
          onClick={reset}
        >
          Retry
        </button>
        <Link
          className="rounded border border-green-700/40 px-4 py-2 text-green-200 hover:border-green-400"
          href="/dash"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}

