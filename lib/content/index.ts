"use server";

import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

import {
  getDirectoryDefinitionById,
  getDirectoryDefinitions,
  type DirectoryDefinition,
  type DirectoryId,
} from "@/lib/directories";
import type {
  Classification,
  ContentRecord,
  FileStatus,
  LinkItem,
} from "./types";

const CLASSIFICATIONS: Classification[] = [
  "UNCLASSIFIED",
  "CONFIDENTIAL",
  "SECRET",
  "TOP SECRET",
];

const STATUSES: FileStatus[] = ["ACTIVE", "ARCHIVED", "DRAFT"];

const prettyCodeOptions = {
  theme: "github-dark-dimmed",
  keepBackground: true,
};

const loadDirectoryRecords = cache(async (directoryId: DirectoryId) => {
  const definition = await getDirectoryDefinitionById(directoryId);
  if (!definition) {
    return [];
  }
  return readDirectoryRecords(definition);
});

export async function getDirectoryRecords(directory: DirectoryId) {
  return loadDirectoryRecords(directory);
}

export async function getAllRecords() {
  const definitions = await getDirectoryDefinitions();
  const results = await Promise.all(
    definitions.map((definition) => getDirectoryRecords(definition.id)),
  );
  return results.flat();
}

export async function getDirectoryCounts() {
  const definitions = await getDirectoryDefinitions();
  const entries = await Promise.all(
    definitions.map(async (definition) => {
      const records = await getDirectoryRecords(definition.id);
      return [definition.id, records.length] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<DirectoryId, number>;
}

export async function getRecordBySlug(directory: DirectoryId, slug: string) {
  const records = await getDirectoryRecords(directory);
  return records.find((record) => record.slug === slug);
}

export async function getAllSlugsByDirectory(directory: DirectoryId) {
  const records = await getDirectoryRecords(directory);
  return records.map((record) => record.slug);
}

async function readDirectoryRecords(definition: DirectoryDefinition) {
  const files = await readDirectoryFiles(definition.contentPath);
  return Promise.all(
    files.map((file) => readRecordFile(definition, file)),
  );
}

async function readRecordFile(
  definition: DirectoryDefinition,
  fileName: string,
) {
  const filePath = path.join(definition.contentPath, fileName);
  const slug = getSlug(fileName);
  const { data, content } = await readMdxFile(filePath);
  validateFrontmatter(
    data as Record<string, unknown>,
    definition.requiredFrontmatter,
    `${definition.id}/${fileName}`,
  );
  const frontmatter = data as Record<string, unknown>;
  const mdx = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
    },
  });

  const updatedAt = normalizeDate(
    ensureDateValue(
      frontmatter[definition.dateField],
      definition.dateField,
      fileName,
    ),
    fileName,
  );

  return normalizeRecord({
    id: ensureString(frontmatter.id, "id", fileName),
    slug,
    directory: definition.id,
    title: ensureString(frontmatter.title, "title", fileName),
    classification: ensureClassification(
      frontmatter.classification as Classification,
      fileName,
    ),
    status: ensureStatus(frontmatter.status as FileStatus, fileName),
    updatedAt,
    tags: ensureStringArray(frontmatter.tags, "tags", fileName),
    summary: ensureString(frontmatter.summary, "summary", fileName),
    owner: optionalString(frontmatter.owner),
    role: optionalString(frontmatter.role),
    timeframe: optionalString(frontmatter.timeframe),
    stack: ensureOptionalStringArray(frontmatter.stack, "stack", fileName),
    links: ensureLinkItems(frontmatter.links, fileName),
    pdfUrl: frontmatter.pdfUrl ? String(frontmatter.pdfUrl) : undefined,
    body: content,
    mdx,
  });
}

function normalizeRecord(record: ContentRecord): ContentRecord {
  return {
    ...record,
    updatedAt: new Date(record.updatedAt).toISOString(),
    tags: record.tags ?? [],
    links: record.links?.map((link) => ({
      label: link.label,
      href: link.href,
    })),
    body: record.body.trim(),
  };
}

async function readDirectoryFiles(directoryPath: string) {
  try {
    const files = await fs.readdir(directoryPath);
    return files.filter((file) => file.endsWith(".mdx")).sort();
  } catch {
    return [];
  }
}

async function readMdxFile(filePath: string) {
  const source = await fs.readFile(filePath, "utf8");
  return matter(source);
}

function getSlug(fileName: string) {
  return fileName.replace(/\.mdx$/, "");
}

function ensureClassification(value: Classification, fileName: string) {
  if (!CLASSIFICATIONS.includes(value)) {
    throw new Error(
      `Invalid classification "${value}" in ${fileName}. Expected one of ${CLASSIFICATIONS.join(", ")}`,
    );
  }
  return value;
}

function ensureStatus(value: FileStatus, fileName: string) {
  if (!STATUSES.includes(value)) {
    throw new Error(
      `Invalid status "${value}" in ${fileName}. Expected one of ${STATUSES.join(", ")}`,
    );
  }
  return value;
}

function normalizeDate(value: string, fileName: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date "${value}" in ${fileName}`);
  }
  return date.toISOString();
}

function validateFrontmatter(
  frontmatter: Record<string, unknown>,
  requiredKeys: string[],
  filePath: string,
) {
  const missing = requiredKeys.filter((key) => frontmatter[key] === undefined);
  if (missing.length) {
    throw new Error(
      `Missing required frontmatter field(s) ${missing.join(", ")} in ${filePath}`,
    );
  }
}

function ensureString(
  value: unknown,
  field: string,
  fileName: string,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid or missing "${field}" in ${fileName}`);
  }
  return value;
}

function ensureDateValue(
  value: unknown,
  field: string,
  fileName: string,
): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  throw new Error(`Invalid or missing "${field}" in ${fileName}`);
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function ensureStringArray(
  value: unknown,
  field: string,
  fileName: string,
): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid "${field}" in ${fileName}`);
  }
  return value as string[];
}

function ensureOptionalStringArray(
  value: unknown,
  field: string,
  fileName: string,
) {
  if (value === undefined) return undefined;
  if (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  ) {
    return value as string[];
  }
  throw new Error(`Invalid "${field}" in ${fileName}; expected an array.`);
}

function ensureLinkItems(
  value: unknown,
  fileName: string,
): LinkItem[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) {
    throw new Error(`Invalid links value in ${fileName}; expected an array.`);
  }
  return value.map((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      typeof (item as LinkItem).label !== "string" ||
      typeof (item as LinkItem).href !== "string"
    ) {
      throw new Error(
        `Invalid link entry in ${fileName}; expected label and href strings.`,
      );
    }
    return {
      label: (item as LinkItem).label,
      href: (item as LinkItem).href,
    };
  });
}

export type { ContentRecord, Classification, FileStatus, LinkItem } from "./types";
