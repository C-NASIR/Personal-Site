export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 py-16 font-mono text-green-200">
      <div className="mb-3 h-3 w-32 animate-pulse rounded-full bg-green-500/30" />
      <p className="text-sm uppercase tracking-[0.4em]">Initializing</p>
      <p className="mt-2 text-xs text-green-400/80">
        Linking secure session with command relay...
      </p>
    </div>
  );
}

