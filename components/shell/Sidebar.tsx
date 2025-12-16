'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DirectoryId } from "@/lib/directories";
import { useDirectoryMetadata } from "../providers/DirectoryProvider";

type SidebarProps = {
  activeDirectory?: DirectoryId;
  counts: Record<DirectoryId, number>;
};

export function Sidebar({ activeDirectory, counts }: SidebarProps) {
  const pathname = usePathname();
  const { directories, directoryMap } = useDirectoryMetadata();
  const currentDirectory = activeDirectory ?? null;
  const profileLinks = [
    { label: "Identity", href: "/about" },
    { label: "Credentials", href: "/credentials" },
    { label: "Secure Comms", href: "/contact" },
  ];

  return (
    <aside className="hidden h-full w-72 flex-shrink-0 overflow-y-auto border-r border-green-900/40 bg-black/50 px-4 py-6 text-sm text-green-100/80 lg:flex lg:flex-col">
      <p className="text-[0.6rem] uppercase tracking-[0.5em] text-green-500/80">
        Directories
      </p>
      <ul className="mt-4 flex-1 space-y-2">
        {directories.map((directory) => {
          const isActive = currentDirectory === directory.id;
          return (
            <li key={directory.id}>
              <Link
                className={clsx(
                  "flex flex-col gap-1 rounded border px-3 py-2 transition",
                  isActive
                    ? "border-green-400/50 bg-green-500/10 text-green-100 shadow-inner shadow-green-400/30"
                    : "border-green-900/30 bg-black/40 hover:border-green-600/40 hover:text-green-50",
                )}
                href={directory.route}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.4em]">
                  {directory.label}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-green-300/70">
                  {counts[directory.id] ?? 0}{" "}
                  {(counts[directory.id] ?? 0) === 1 ? "Entry" : "Entries"}
                </span>
                <span className="text-[0.65rem] leading-relaxed text-green-200/70">
                  {directory.description}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6">
        <p className="text-[0.6rem] uppercase tracking-[0.5em] text-green-500/80">
          Profile & Comms
        </p>
        <ul className="mt-3 space-y-2 text-[0.9rem]">
          {profileLinks.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  className={clsx(
                    "block rounded border px-3 py-2 text-sm uppercase tracking-[0.35em] transition",
                    isActive
                      ? "border-green-400/50 bg-green-500/10 text-green-50"
                      : "border-green-900/30 bg-black/40 hover:border-green-600/40 hover:text-green-50",
                  )}
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {currentDirectory ? (
        <div className="mt-4 text-[0.6rem] uppercase tracking-[0.35em] text-green-500/70">
          Active node:{" "}
          {directoryMap[currentDirectory]
            ? directoryMap[currentDirectory].label
            : currentDirectory}
        </div>
      ) : null}
    </aside>
  );
}

export default Sidebar;
