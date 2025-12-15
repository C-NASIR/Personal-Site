export type DirectoryId = "case" | "intel" | "logs" | "credentials";

export type DirectoryMeta = {
  id: DirectoryId;
  label: string;
  description: string;
};

export const directories: DirectoryMeta[] = [
  {
    id: "case",
    label: "Case Files",
    description:
      "Flagship build dossiers documenting the problem, architecture, and operational outcomes.",
  },
  {
    id: "intel",
    label: "Intel Reports",
    description:
      "Long-form research and architecture notes gathered while supporting different orgs.",
  },
  {
    id: "logs",
    label: "Activity Logs",
    description:
      "Short bursts from the field describing live experiments, incidents, and follow ups.",
  },
  {
    id: "credentials",
    label: "Credentials",
    description:
      "Structured skill matrices, resume artifacts, and comms links for quick validation.",
  },
] satisfies DirectoryMeta[];

export const directoryMap = directories.reduce(
  (acc, directory) => {
    acc[directory.id] = directory;
    return acc;
  },
  {} as Record<DirectoryId, DirectoryMeta>,
);

export function directoryRoute(directory: DirectoryId) {
  return directory === "case" ? "/dash" : `/files/${directory}`;
}

export function isDirectoryId(value: string): value is DirectoryId {
  return directories.some((directory) => directory.id === value);
}
