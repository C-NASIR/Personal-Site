'use client';

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type TopBarProps = {
  breadcrumbs: BreadcrumbItem[];
};

export function TopBar({ breadcrumbs }: TopBarProps) {
  const [clock, setClock] = useState(() => new Date());
  const sessionId = useMemo(() => createSessionId(), []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="border-b border-green-900/40 bg-black/60 px-6 py-4 text-xs uppercase tracking-[0.35em] text-green-300/80">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="flex flex-wrap items-center gap-2 text-[0.65rem] tracking-[0.4em]">
          {breadcrumbs.map((item, index) => (
            <span className="flex items-center gap-2" key={item.label}>
              {index > 0 ? (
                <span aria-hidden className="text-green-500/70">
                  ▸
                </span>
              ) : null}
              {item.href ? (
                <Link
                  className="text-green-200 transition hover:text-green-50"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-green-100">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-4 text-[0.6rem] tracking-[0.35em]">
          <Status label="Clearance">Level VII</Status>
          <Status label="Clock">
            {clock.toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </Status>
          <Status label="Session">{sessionId}</Status>
          <Status label="Systems">
            <span className="text-green-200">Nominal</span>
          </Status>
        </div>
      </div>
    </header>
  );
}

type StatusProps = {
  label: string;
  children: ReactNode;
};

function Status({ label, children }: StatusProps) {
  return (
    <span className="space-x-2">
      <span className="text-green-500/70">{label}</span>
      <span className="font-semibold tracking-[0.3em] text-green-100">
        {children}
      </span>
    </span>
  );
}

function createSessionId() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let token = "";
  for (let index = 0; index < 10; index += 1) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}

export default TopBar;
