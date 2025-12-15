'use client';

import { useEffect, useMemo, useState, type ReactNode } from "react";

type BootScreenProps = {
  lines: readonly string[];
  visibleCount: number;
  sessionId: string | null;
  onSkip: () => void;
};

export function BootScreen({
  lines,
  visibleCount,
  sessionId,
  onSkip,
}: BootScreenProps) {
  const [systemTime, setSystemTime] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSystemTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const visibleLines = useMemo(
    () => lines.slice(0, visibleCount),
    [lines, visibleCount],
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-6 py-12 font-mono text-green-100">
      <button
        aria-label="Skip boot sequence"
        className="absolute right-6 top-6 rounded border border-green-600/60 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.3em] text-green-200 transition hover:border-green-400 hover:text-green-100"
        type="button"
        onClick={onSkip}
      >
        Skip
      </button>

      <div className="w-full max-w-3xl space-y-3 text-base leading-relaxed sm:text-lg">
        {visibleLines.map((line, index) => {
          const isLastVisible = index === visibleLines.length - 1;

          return (
            <p
              className="flex items-center gap-3 text-green-100/90"
              key={`${line}-${index}`}
            >
              <span className="text-green-400/70">▸</span>
              <span className="flex-1">
                {line}
                {isLastVisible ? (
                  <span className="ml-2 inline-block h-4 w-2 animate-pulse bg-green-300 align-middle" />
                ) : null}
              </span>
            </p>
          );
        })}
      </div>

      <div className="mt-16 w-full max-w-3xl border-t border-green-900/60 pt-6 text-xs uppercase tracking-wide text-green-400/80 sm:text-sm">
        <p className="text-sm tracking-[0.3em] text-green-200/80">
          Welcome, Secret Agency
        </p>
        <div className="mt-4 grid gap-4 text-green-200/90 sm:grid-cols-2 lg:grid-cols-4">
          <MetadataItem label="Clearance">
            Level {sessionId && sessionId.length > 10 ? "VII" : "IV"}
          </MetadataItem>
          <MetadataItem label="Session ID">
            {sessionId ?? "INITIALIZING"}
          </MetadataItem>
          <MetadataItem label="System time">
            {systemTime.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </MetadataItem>
          <MetadataItem label="Status">Console standing by</MetadataItem>
        </div>
      </div>
    </div>
  );
}

type MetadataItemProps = {
  label: string;
  children: ReactNode;
};

function MetadataItem({ label, children }: MetadataItemProps) {
  return (
    <div className="space-y-1 border border-green-800/40 bg-black/40 px-4 py-3 text-xs tracking-widest text-green-300/80">
      <p className="text-[0.6rem] text-green-500/70">{label}</p>
      <p className="text-sm text-green-100">{children}</p>
    </div>
  );
}

export default BootScreen;
