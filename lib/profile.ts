"use server";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";

import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { SkillCategory } from "@/content/profile/skills";

const PROFILE_DIR = path.join(process.cwd(), "content/profile");

export type IdentityProfile = {
  title: string;
  dossierId: string;
  classification: string;
  updatedAt: string;
  summary: string;
  name: string;
  role: string;
  location: string;
  clearanceLevel: string;
  sessionId: string;
  contactHandle: string;
  targetRoles: string[];
  primaryStack: string[];
  missionTag: string;
  mdx: MDXRemoteSerializeResult;
};

export async function getIdentityProfile(): Promise<IdentityProfile> {
  const aboutPath = path.join(PROFILE_DIR, "about.mdx");
  const source = await fs.readFile(aboutPath, "utf8");
  const { data, content } = matter(source);
  const mdx = await serialize(content);
  const frontmatter = data as Record<string, unknown>;

  return {
    title: String(frontmatter.title ?? "Identity Profile"),
    dossierId: String(frontmatter.dossierId ?? "IP-01"),
    classification: String(frontmatter.classification ?? "UNCLASSIFIED"),
    updatedAt: String(frontmatter.updatedAt ?? new Date().toISOString()),
    summary: String(frontmatter.summary ?? ""),
    name: String(frontmatter.name ?? "Unknown Operative"),
    role: String(frontmatter.role ?? "Product Engineer"),
    location: String(frontmatter.location ?? "Remote"),
    clearanceLevel: String(frontmatter.clearanceLevel ?? "VII"),
    sessionId: String(frontmatter.sessionId ?? "IDENTITY"),
    contactHandle: String(frontmatter.contactHandle ?? "secure@domain"),
    targetRoles: Array.isArray(frontmatter.targetRoles)
      ? (frontmatter.targetRoles as string[])
      : [],
    primaryStack: Array.isArray(frontmatter.primaryStack)
      ? (frontmatter.primaryStack as string[])
      : [],
    missionTag: String(frontmatter.missionTag ?? ""),
    mdx,
  };
}

export async function getSkillsMatrix(): Promise<SkillCategory[]> {
  const skillsModule = await import("@/content/profile/skills");
  return skillsModule.skillCategories;
}
