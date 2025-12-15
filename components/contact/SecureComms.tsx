'use client';

import { useState } from "react";

type SecureCommsProps = {
  email: string;
  links: {
    label: string;
    href: string;
  }[];
};

export function SecureComms({ email, links }: SecureCommsProps) {
  const [status, setStatus] = useState("Channel idle");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Channel secured. Address copied.");
    } catch {
      setStatus("Copy failed. Use mailto link instead.");
    }
  };

  const handleMailto = () => {
    setStatus("Message ready for dispatch.");
    window.location.href = `mailto:${email}?subject=Secure%20Comms%20Request`;
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded border border-green-900/40 bg-black/60 p-6 text-green-100">
      <header className="border-b border-green-900/30 pb-4">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-green-500/70">
          Secure Comms
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-green-50">
          Send your transmission
        </h1>
        <p className="text-sm text-green-200/80">
          Preferred contact channel is email. Alternate channels open in a new
          tab.
        </p>
      </header>
      <div className="rounded border border-green-900/30 bg-black/40 p-4 text-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-green-500/70">
          Primary channel
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <code className="rounded border border-green-800/40 bg-black/50 px-3 py-1 text-green-100">
            {email}
          </code>
          <button
            className="rounded border border-green-700/50 px-3 py-1 text-xs uppercase tracking-[0.35em] text-green-200 hover:border-green-400"
            type="button"
            onClick={copyEmail}
          >
            Copy
          </button>
          <button
            className="rounded border border-green-500/60 px-3 py-1 text-xs uppercase tracking-[0.35em] text-green-50 hover:border-green-300"
            type="button"
            onClick={handleMailto}
          >
            Compose secure email
          </button>
        </div>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-green-400/80">
          {status}
        </p>
      </div>
      <div className="rounded border border-green-900/30 bg-black/40 p-4 text-sm">
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-green-500/70">
          Alternate channels
        </p>
        <ul className="mt-3 space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                className="flex items-center justify-between rounded border border-green-800/40 px-3 py-2 text-green-200 hover:border-green-400"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>{link.label}</span>
                <span className="text-[0.6rem] uppercase tracking-[0.3em]">
                  Open
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SecureComms;

