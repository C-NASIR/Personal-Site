import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 py-16 text-center font-mono text-green-100">
      <p className="text-[0.65rem] uppercase tracking-[0.5em] text-green-500/70">
        404 — Record not found
      </p>
      <h1 className="mt-4 text-4xl font-semibold text-green-50">
        This dossier is redacted.
      </h1>
      <p className="mt-3 max-w-lg text-sm text-green-200/80">
        The file you requested no longer exists or requires additional clearance.
        Return to the dashboard to resume your session.
      </p>
      <Link
        className="mt-6 rounded border border-green-500/60 px-4 py-2 text-xs uppercase tracking-[0.4em] text-green-50 hover:border-green-300"
        href="/dash"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

