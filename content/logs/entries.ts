export type LogEntry = {
  slug: string;
  date: string;
  title: string;
  body: string;
  classification?: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET" | "TOP SECRET";
  status?: "ACTIVE" | "ARCHIVED" | "DRAFT";
  tags?: string[];
  summary?: string;
  links?: { label: string; href: string }[];
};

export const logEntries: LogEntry[] = [
  {
    slug: "uplink-hotfix",
    date: "2024-11-30T04:42:00.000Z",
    title: "Uplink Hotfix",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    tags: ["Hotfix", "Telemetry"],
    summary:
      "Patched a race condition that dropped packets during orbital hand-offs and added instrumentation to keep it from regressing.",
    body: `A regression in the telemetry multiplexer meant packets were discarded whenever two satellites handed off within the same 200ms window. We shipped a guard that queues overlapping transfers and emits an alert the second a counter desyncs.`,
  },
  {
    slug: "palette-beta",
    date: "2024-08-14T21:10:00.000Z",
    title: "Command Palette Beta",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    tags: ["UX", "Keyboard"],
    summary:
      "Launched palette beta to 30 analysts with scoped verbs, guard rails, and issue instrumentation wired into the dashboard.",
    body: `Analysts can now triage intel, open dossiers, or send comms without touching the sidebar. Every command carries context so we can measure where folks hesitate.`,
  },
  {
    slug: "infra-tune-up",
    date: "2024-05-22T09:15:00.000Z",
    title: "Infra Tune-Up",
    classification: "CONFIDENTIAL",
    status: "ARCHIVED",
    tags: ["Platform", "Migration"],
    summary:
      "Finished the control plane migration onto the hardened VPC and published the rollout checklist for the next cutover.",
    body: `Traffic switched over at 03:15 without a blip. Followed up with a set of alerts that confirm every subsystem is reporting before we call the cutover done.`,
  },
] satisfies LogEntry[];

