'use client';

import clsx from "clsx";
import type { ReactNode } from "react";

import { AUTH_STEPS } from "./bootConfig";

type LoginScreenProps = {
  sessionId: string;
  stepIndex: number;
  isGranted: boolean;
  onSkip: () => void;
};

export function LoginScreen({
  sessionId,
  stepIndex,
  isGranted,
  onSkip,
}: LoginScreenProps) {
  const status =
    AUTH_STEPS[stepIndex] ?? AUTH_STEPS[AUTH_STEPS.length - 1];
  const progress =
    Math.min(stepIndex + 1, AUTH_STEPS.length) / AUTH_STEPS.length;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12 font-mono text-green-100">
      <button
        aria-label="Skip authentication sequence"
        className="absolute right-6 top-6 rounded border border-green-600/60 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.3em] text-green-200 transition hover:border-green-400 hover:text-green-100"
        type="button"
        onClick={onSkip}
      >
        Skip
      </button>

      <div className="w-full max-w-2xl rounded-lg border border-green-800/40 bg-black/60 p-8 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
        <p className="text-xs uppercase tracking-[0.5em] text-green-400/80">
          Credential Verification
        </p>

        <div className="mt-6 grid gap-4 text-sm text-green-100/90 sm:grid-cols-2">
          <Field label="User">OPERATIVE XN-17</Field>
          <Field label="Clearance">LEVEL {sessionId.length > 10 ? "OMEGA" : "V"}</Field>
          <Field label="Token">{sessionId}</Field>
          <Field label="Status">
            <span
              className={clsx(
                "inline-flex items-center rounded-full px-3 py-1 text-xs uppercase tracking-widest",
                isGranted
                  ? "border border-green-300/80 bg-green-500/10 text-green-200"
                  : "border border-yellow-400/40 bg-yellow-500/10 text-yellow-100",
              )}
            >
              {status}
            </span>
          </Field>
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.4em] text-green-500/80">
            Progress
          </p>
          <div className="mt-3 h-3 w-full rounded-full border border-green-700/60 bg-black/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-400 via-green-300 to-green-200 transition-all duration-500"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              aria-label="Verification progress"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-10 min-h-24 rounded border border-green-700/60 bg-black/50 p-6">
          {isGranted ? (
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.5em] text-green-400">
                Access granted
              </p>
              <p className="text-lg text-green-100">
                Session unlocked. Redirecting to command dashboard...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.5em] text-green-300/80">
                Running checks
              </p>
              <ul className="space-y-1 text-green-200/90">
                {AUTH_STEPS.slice(0, stepIndex + 1).map((step) => (
                  <li key={step}>▸ {step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <div className="space-y-1 border border-green-800/40 bg-black/40 px-4 py-3">
      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-green-500/70">
        {label}
      </p>
      <p className="font-semibold text-green-100">{children}</p>
    </div>
  );
}

export default LoginScreen;
