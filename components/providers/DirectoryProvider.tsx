'use client';

import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { DirectoryMeta } from "@/lib/directories";

type DirectoryContextValue = {
  directories: DirectoryMeta[];
  directoryMap: Record<string, DirectoryMeta>;
};

const DirectoryContext = createContext<DirectoryContextValue | null>(null);

type DirectoryProviderProps = {
  directories: DirectoryMeta[];
  children: ReactNode;
};

export function DirectoryProvider({
  directories,
  children,
}: DirectoryProviderProps) {
  const value = useMemo<DirectoryContextValue>(() => {
    const directoryMap = directories.reduce<Record<string, DirectoryMeta>>(
      (acc, directory) => {
        acc[directory.id] = directory;
        return acc;
      },
      {},
    );
    return { directories, directoryMap };
  }, [directories]);

  return (
    <DirectoryContext.Provider value={value}>
      {children}
    </DirectoryContext.Provider>
  );
}

export function useDirectoryMetadata() {
  const context = useContext(DirectoryContext);
  if (!context) {
    throw new Error(
      "useDirectoryMetadata must be used within a DirectoryProvider",
    );
  }

  return context;
}
