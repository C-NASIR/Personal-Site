"use server";

import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

export type DirectoryId = string;

export type DirectoryMeta = {
  id: DirectoryId;
  label: string;
  description: string;
  route: string;
  sortOrder: number;
};

type DirectoryDefinition = DirectoryMeta & {
  contentPath: string;
  dateField: string;
  requiredFrontmatter: string[];
};

type DirectoryConfigFile = Partial<{
  label: string;
  description: string;
  route: string;
  sortOrder: number;
  dateField: string;
  requiredFrontmatter: string[];
}>;

const METADATA_FILENAME = "directory.json";
const CONTENT_ROOT = path.join(process.cwd(), "content");
const DEFAULT_REQUIRED_FIELDS = [
  "id",
  "title",
  "classification",
  "status",
  "summary",
  "tags",
];

const loadDirectoryDefinitions = cache(async () => {
  const entries = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  const definitions: DirectoryDefinition[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const directoryId = entry.name;
    const directoryPath = path.join(CONTENT_ROOT, directoryId);
    const configPath = path.join(directoryPath, METADATA_FILENAME);

    let config: DirectoryConfigFile;
    try {
      const source = await fs.readFile(configPath, "utf8");
      config = JSON.parse(source) as DirectoryConfigFile;
    } catch {
      continue;
    }

    const label = config.label ?? formatLabel(directoryId);
    const description = config.description ?? "";
    const route = config.route ?? `/files/${directoryId}`;
    const sortOrder = config.sortOrder ?? 100;
    const dateField = config.dateField ?? "updatedAt";
    const requiredFrontmatter = dedupeFields([
      ...DEFAULT_REQUIRED_FIELDS,
      dateField,
      ...(config.requiredFrontmatter ?? []),
    ]);

    definitions.push({
      id: directoryId,
      label,
      description,
      route,
      sortOrder,
      contentPath: directoryPath,
      dateField,
      requiredFrontmatter,
    });
  }

  return definitions.sort((a, b) => a.sortOrder - b.sortOrder);
});

export async function getDirectoryDefinitions() {
  return loadDirectoryDefinitions();
}

export async function getDirectoryMetas(): Promise<DirectoryMeta[]> {
  const definitions = await loadDirectoryDefinitions();
  return definitions.map(
    ({ id, label, description, route, sortOrder }) => ({
      id,
      label,
      description,
      route,
      sortOrder,
    }),
  );
}

export async function getDirectoryDefinitionById(id: DirectoryId) {
  const definitions = await loadDirectoryDefinitions();
  return definitions.find((definition) => definition.id === id);
}

export async function isDirectoryId(value: string): Promise<boolean> {
  const definitions = await loadDirectoryDefinitions();
  return definitions.some((definition) => definition.id === value);
}

export type { DirectoryDefinition };

function formatLabel(input: string) {
  return input
    .split(/[-_]/)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function dedupeFields(fields: string[]) {
  return Array.from(new Set(fields));
}
