import type { MDXRemoteSerializeResult } from "next-mdx-remote";

import type { DirectoryId } from "@/lib/directories";

export type Classification =
  | "UNCLASSIFIED"
  | "CONFIDENTIAL"
  | "SECRET"
  | "TOP SECRET";

export type FileStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";

export type LinkItem = {
  label: string;
  href: string;
};

export type ContentRecord = {
  id: string;
  slug: string;
  directory: DirectoryId;
  title: string;
  classification: Classification;
  status: FileStatus;
  updatedAt: string;
  tags: string[];
  summary: string;
  owner?: string;
  role?: string;
  timeframe?: string;
  stack?: string[];
  links?: LinkItem[];
  pdfUrl?: string;
  body: string;
  mdx: MDXRemoteSerializeResult;
};
