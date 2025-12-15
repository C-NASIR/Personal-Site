"use server";

import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { serialize } from "next-mdx-remote/serialize";

import type { DirectoryId } from "@/lib/directories";
import type {
  Classification,
  ContentRecord,
  FileStatus,
  LinkItem,
} from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const CASE_DIR = path.join(CONTENT_ROOT, "case");
const INTEL_DIR = path.join(CONTENT_ROOT, "intel");
const CREDENTIALS_DIR = path.join(CONTENT_ROOT, "credentials");
const LOGS_DIR = path.join(CONTENT_ROOT, "logs");

const CLASSIFICATIONS: Classification[] = [
  "UNCLASSIFIED",
  "CONFIDENTIAL",
  "SECRET",
  "TOP SECRET",
];

const STATUSES: FileStatus[] = ["ACTIVE", "ARCHIVED", "DRAFT"];

type CaseFrontmatter = {
  id: string;
  title: string;
  classification: Classification;
  status: FileStatus;
  updatedAt: string;
  owner: string;
  role: string;
  timeframe: string;
  stack: string[];
  tags: string[];
  summary: string;
  links?: LinkItem[];
};

type IntelFrontmatter = {
  id: string;
  title: string;
  classification: Classification;
  status: FileStatus;
  publishedAt: string;
  tags: string[];
  summary: string;
  links?: LinkItem[];
};

type CredentialFrontmatter = {
  id: string;
  title: string;
  classification: Classification;
  status: FileStatus;
  updatedAt: string;
  tags: string[];
  summary: string;
  owner?: string;
  links?: LinkItem[];
};

type LogFrontmatter = {
  id: string;
  title: string;
  classification: Classification;
  status: FileStatus;
  date: string;
  tags: string[];
  summary: string;
  links?: LinkItem[];
};

const loadCaseFiles = cache(async () => {
  const files = await readDirectoryFiles(CASE_DIR);
  return Promise.all(
    files.map(async (file) => {
      const slug = getSlug(file);
      const { data, content } = await readMdxFile(CASE_DIR, file);
      const frontmatter = data as Partial<CaseFrontmatter>;
      validateFrontmatter(frontmatter, ["id", "title", "classification", "status", "updatedAt", "owner", "role", "timeframe", "stack", "tags", "summary"], `case/${file}`);
      const mdx = await serialize(content);
      const normalized = normalizeRecord({
        id: frontmatter.id!,
        slug,
        directory: "case",
        title: frontmatter.title!,
        classification: ensureClassification(frontmatter.classification!, file),
        status: ensureStatus(frontmatter.status!, file),
        updatedAt: normalizeDate(frontmatter.updatedAt!, file),
        tags: frontmatter.tags!,
        summary: frontmatter.summary!,
        owner: frontmatter.owner,
        role: frontmatter.role,
        timeframe: frontmatter.timeframe,
        stack: frontmatter.stack,
        links: frontmatter.links,
        body: content,
        mdx,
      });
      return normalized;
    }),
  );
});

const loadIntelReports = cache(async () => {
  const files = await readDirectoryFiles(INTEL_DIR);
  return Promise.all(
    files.map(async (file) => {
      const slug = getSlug(file);
      const { data, content } = await readMdxFile(INTEL_DIR, file);
      const frontmatter = data as Partial<IntelFrontmatter>;
      validateFrontmatter(frontmatter, ["id", "title", "classification", "status", "publishedAt", "tags", "summary"], `intel/${file}`);
      const mdx = await serialize(content);
      return normalizeRecord({
        id: frontmatter.id!,
        slug,
        directory: "intel",
        title: frontmatter.title!,
        classification: ensureClassification(frontmatter.classification!, file),
        status: ensureStatus(frontmatter.status!, file),
        updatedAt: normalizeDate(frontmatter.publishedAt!, file),
        tags: frontmatter.tags!,
        summary: frontmatter.summary!,
        links: frontmatter.links,
        body: content,
        mdx,
      });
    }),
  );
});

const loadCredentials = cache(async () => {
  const files = await readDirectoryFiles(CREDENTIALS_DIR);
  return Promise.all(
    files.map(async (file) => {
      const slug = getSlug(file);
      const { data, content } = await readMdxFile(CREDENTIALS_DIR, file);
      const frontmatter = data as Partial<CredentialFrontmatter>;
      validateFrontmatter(frontmatter, ["id", "title", "classification", "status", "updatedAt", "tags", "summary"], `credentials/${file}`);
      const mdx = await serialize(content);
      return normalizeRecord({
        id: frontmatter.id!,
        slug,
        directory: "credentials",
        title: frontmatter.title!,
        classification: ensureClassification(frontmatter.classification!, file),
        status: ensureStatus(frontmatter.status!, file),
        updatedAt: normalizeDate(frontmatter.updatedAt!, file),
        tags: frontmatter.tags!,
        summary: frontmatter.summary!,
        owner: frontmatter.owner,
        links: frontmatter.links,
        body: content,
        mdx,
      });
    }),
  );
});

const loadLogs = cache(async () => {
  const files = await readDirectoryFiles(LOGS_DIR);
  return Promise.all(
    files.map(async (file) => {
      const slug = getSlug(file);
      const { data, content } = await readMdxFile(LOGS_DIR, file);
      const frontmatter = data as Partial<LogFrontmatter>;
      validateFrontmatter(
        frontmatter,
        ["id", "title", "classification", "status", "date", "tags", "summary"],
        `logs/${file}`,
      );
      const mdx = await serialize(content);
      return normalizeRecord({
        id: frontmatter.id!,
        slug,
        directory: "logs",
        title: frontmatter.title!,
        classification: ensureClassification(frontmatter.classification!, file),
        status: ensureStatus(frontmatter.status!, file),
        updatedAt: normalizeDate(frontmatter.date!, file),
        tags: frontmatter.tags!,
        summary: frontmatter.summary!,
        links: frontmatter.links,
        body: content,
        mdx,
      });
    }),
  );
});

export async function getCaseFiles() {
  return loadCaseFiles();
}

export async function getIntelReports() {
  return loadIntelReports();
}

export async function getCredentials() {
  return loadCredentials();
}

export async function getLogs() {
  return loadLogs();
}

export async function getDirectoryRecords(directory: DirectoryId) {
  switch (directory) {
    case "case":
      return getCaseFiles();
    case "intel":
      return getIntelReports();
    case "logs":
      return getLogs();
    case "credentials":
      return getCredentials();
    default:
      return [];
  }
}

export async function getAllRecords() {
  const [caseFiles, intelReports, logs, credentials] = await Promise.all([
    getCaseFiles(),
    getIntelReports(),
    getLogs(),
    getCredentials(),
  ]);

  return [...caseFiles, ...intelReports, ...logs, ...credentials];
}

export async function getDirectoryCounts() {
  const [caseFiles, intelReports, logs, credentials] = await Promise.all([
    getCaseFiles(),
    getIntelReports(),
    getLogs(),
    getCredentials(),
  ]);

  return {
    case: caseFiles.length,
    intel: intelReports.length,
    logs: logs.length,
    credentials: credentials.length,
  } as Record<DirectoryId, number>;
}

export async function getRecordBySlug(
  directory: DirectoryId,
  slug: string,
) {
  const records = await getDirectoryRecords(directory);
  return records.find((record) => record.slug === slug);
}

export async function getAllSlugsByDirectory(directory: DirectoryId) {
  const records = await getDirectoryRecords(directory);
  return records.map((record) => record.slug);
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

async function readMdxFile(directoryPath: string, fileName: string) {
  const filePath = path.join(directoryPath, fileName);
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
  frontmatter: Partial<Record<string, unknown>>,
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

export type { ContentRecord, Classification, FileStatus, LinkItem } from "./types";
