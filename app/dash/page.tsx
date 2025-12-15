export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12 font-mono text-green-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-lg border border-green-800/40 bg-black/60 p-8 text-left shadow-[0_0_30px_rgba(16,185,129,0.15)]">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-green-500/70">
            Clearance confirmed
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-green-100">
            Dashboard loaded
          </h1>
          <p className="mt-2 text-green-200/80">
            This placeholder represents the classified workspace shell that will
            be fleshed out in future phases.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {["Files mounted", "Systems nominal", "Awaiting directives"].map(
            (item) => (
              <div
                className="rounded border border-green-800/30 bg-black/40 p-4 text-sm uppercase tracking-[0.2em] text-green-300/80"
                key={item}
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
