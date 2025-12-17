'use client';

import { useEffect, useState, type ReactNode } from "react";

import type { DirectoryId } from "@/lib/directories";

import { Sidebar } from "./Sidebar";
import { TopBar, type BreadcrumbItem } from "./TopBar";

type ShellLayoutProps = {
  activeDirectory?: DirectoryId;
  breadcrumbs?: BreadcrumbItem[];
  directoryCounts: Record<DirectoryId, number>;
  children: ReactNode;
};

export function ShellLayout({
  activeDirectory,
  breadcrumbs,
  directoryCounts,
  children,
}: ShellLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col lg:h-screen">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <TopBar
        breadcrumbs={breadcrumbs}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
      />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          activeDirectory={activeDirectory}
          counts={directoryCounts}
          variant="desktop"
        />
        <main
          className="flex-1 min-h-0 overflow-y-auto border-l border-green-900/30 bg-black/40"
          id="main-content"
        >
          {children}
        </main>
      </div>

      {isSidebarOpen ? (
        <div
          aria-label="Mobile navigation"
          className="fixed inset-0 z-40 bg-black/85 backdrop-blur-sm lg:hidden"
        >
          <div
            aria-hidden
            className="absolute inset-0"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 flex h-full w-full flex-col border-l border-green-900/40 bg-[#050505] shadow-2xl">
            <div className="flex items-center justify-between border-b border-green-900/50 px-6 py-4 text-xs uppercase tracking-[0.3em] text-green-400/80">
              <span>Secure Navigation</span>
              <button
                aria-label="Close menu"
                className="rounded border border-green-700/60 px-2 py-1 text-green-200 transition hover:border-green-400 hover:text-green-50"
                type="button"
                onClick={() => setSidebarOpen(false)}
              >
                ✕
              </button>
            </div>
            <Sidebar
              activeDirectory={activeDirectory}
              counts={directoryCounts}
              variant="mobile"
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ShellLayout;
