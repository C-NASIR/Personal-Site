export type DirectoryId = "case" | "intel" | "logs" | "credentials";

export type DirectoryMeta = {
  id: DirectoryId;
  label: string;
  description: string;
};

export type Classification = "CONFIDENTIAL" | "SECRET" | "TOP SECRET";
export type FileStatus = "ACTIVE" | "ARCHIVED" | "DRAFT";

export type FileRecord = {
  id: string;
  slug: string;
  directory: DirectoryId;
  title: string;
  classification: Classification;
  status: FileStatus;
  owner: string;
  updated: string;
  tags: string[];
  summary: string;
  body: string;
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

export const files: FileRecord[] = [
  {
    id: "CF-9021",
    slug: "orbital-commerce-stack",
    directory: "case",
    title: "Orbital Commerce Stack",
    classification: "TOP SECRET",
    status: "ACTIVE",
    owner: "Aquila Division",
    updated: "2024-12-12T13:00:00Z",
    tags: ["Next.js", "GraphQL", "Payments"],
    summary:
      "Rebuilt the flagship e-commerce supply chain for orbital launch manifests with 38% faster orchestration.",
    body: `The orbital storefront previously shipped as a monolith with brittle checkout logic and a six minute deploy window. We decomposed the workflow into deterministic services that run on an event bus, allowing each launch order to reconcile against satellite availability and fuel constraints on the fly.

Designing the orchestration layer meant pairing a typed GraphQL gateway with an async job coordinator that could hydrate mission data in under 200ms. I built the workflow DSL, the background executor, and the guard rails that prevent conflicting launch windows.

Once the control plane stabilized we turned to instrumentation. Every transaction now emits a structured trail with idempotent replay helpers so the ops team can rewind a broken manifest and the finance teams can trace settlement back to a ledger entry.`,
  },
  {
    id: "CF-8810",
    slug: "signal-fusion-console",
    directory: "case",
    title: "Signal Fusion Console",
    classification: "SECRET",
    status: "ACTIVE",
    owner: "Atlas Sensors",
    updated: "2024-10-02T09:45:00Z",
    tags: ["WebGL", "Edge Caching", "SSE"],
    summary:
      "Unified eight sensor programs into a single command console with live anomaly detection overlays.",
    body: `Command had four separate consoles for the same telemetry stack which meant every incident required hopping across tools. I partnered with the field engineers to map the overlapping data streams and design a fused schema we could query once.

We shipped a streaming pipeline that reduces 11k events per second into a 60 FPS visualization on commodity hardware. The main challenges were sequencing updates when the network dropped and preventing back pressure from saturating the browser.

I added a compact rule builder that lets analysts authorize a trigger, preview its blast radius, and ship it to production without leaving the console.`,
  },
  {
    id: "CF-8604",
    slug: "sovereign-identity-network",
    directory: "case",
    title: "Sovereign Identity Network",
    classification: "SECRET",
    status: "ARCHIVED",
    owner: "Civic Systems",
    updated: "2024-07-18T22:30:00Z",
    tags: ["Rust", "Zero Knowledge", "Wallet"],
    summary:
      "Published a zero-trust identity mesh that issued attestations across three hostile regions.",
    body: `The project demanded an auditable ledger that could survive partitioned networks. We chose a Rust-based runtime with succinct proofs so that offline regions could mint approvals and sync later.

I designed the attestation builder, the gossip reconciliation strategy, and the hooks used by integrators to plug in their own policy engines. We hit 12k verified claims per second without compromising confidentiality.`,
  },
  {
    id: "CF-8312",
    slug: "ops-briefing-platform",
    directory: "case",
    title: "Ops Briefing Platform",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    owner: "Strike Systems",
    updated: "2024-04-09T14:15:00Z",
    tags: ["Next.js", "MDX", "Design Systems"],
    summary:
      "Shipped a briefing platform that lets leadership compose multimodal updates without touching code.",
    body: `Leadership needed a way to disseminate cross-team intelligence in under an hour. We created a templated briefing platform using MDX with strict lint rules so every update reads like a classified cable.

The biggest unlock was authoring atomic UI tokens. Designers can drag and drop real mission markers, while the renderer enforces contrast and readability for accessibility.`,
  },
  {
    id: "CF-8010",
    slug: "mission-replay-engine",
    directory: "case",
    title: "Mission Replay Engine",
    classification: "SECRET",
    status: "DRAFT",
    owner: "Simulation Group",
    updated: "2023-12-11T08:05:00Z",
    tags: ["Three.js", "Temporal DB", "Analytics"],
    summary:
      "In-flight work on a 4D replay system that stitches telemetry, comms, and operator notes into one narrative.",
    body: `We're prototyping a replay engine that projects telemetry and communications into a synchronized timeline. Operators can scrub through the log, drop annotations, then export a signed report for post mission reviews.

The data layer sits on top of a temporal database with vector search abilities to align human annotations with sensor metadata.`,
  },
  {
    id: "CF-7801",
    slug: "high-side-sre-kit",
    directory: "case",
    title: "High Side SRE Kit",
    classification: "CONFIDENTIAL",
    status: "ARCHIVED",
    owner: "Reliability Guild",
    updated: "2023-10-23T17:20:00Z",
    tags: ["Terraform", "Observability", "Playbooks"],
    summary:
      "Codified an SRE starter kit for air-gapped deployments plus a chaos handbook for responders.",
    body: `The high-side program could not import standard tooling, so we distilled a slim SRE kit that vendors could audit line by line. The kit includes Terraform modules, canary functions, and a runbook generator that enforces consistent remediation notes.`,
  },
  {
    id: "IR-1320",
    slug: "edge-cache-debrief",
    directory: "intel",
    title: "Edge Cache Debrief",
    classification: "SECRET",
    status: "ACTIVE",
    owner: "Field Intel",
    updated: "2024-11-03T16:10:00Z",
    tags: ["Edge", "Caching", "Networking"],
    summary:
      "Notes from a six month cache hardening initiative across six remote uplink stations.",
    body: `Compiled the incidents, mitigations, and diagnostics taken while hardening the caching mesh that serves disconnected uplinks. The report includes bandwidth saving recipes and ways to detect stale data before crews notice.`,
  },
  {
    id: "IR-1214",
    slug: "command-palette-patterns",
    directory: "intel",
    title: "Command Palette Patterns",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    owner: "Design Bureau",
    updated: "2024-08-16T19:30:00Z",
    tags: ["UX", "Keyboard", "Search"],
    summary:
      "What worked (and didn't) while rolling a command palette across multiple internal surfaces.",
    body: `A teardown of palette ergonomics: keybinding conflicts, ranking strategies, and progressive disclosure for sensitive actions.`,
  },
  {
    id: "IR-1150",
    slug: "resilience-playbook",
    directory: "intel",
    title: "Resilience Playbook",
    classification: "SECRET",
    status: "ARCHIVED",
    owner: "Reliability Guild",
    updated: "2024-05-22T11:02:00Z",
    tags: ["SRE", "Chaos", "Incident"],
    summary:
      "Documented the chaos drills and the tooling we used to keep operators confident under fire.",
    body: `Includes facilitation scripts, scoring rubrics, and the dashboards that let leadership grade the drill in real time.`,
  },
  {
    id: "IR-1091",
    slug: "low-bandwidth-ux",
    directory: "intel",
    title: "Low Bandwidth UX",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    owner: "Atlas Sensors",
    updated: "2024-02-10T07:50:00Z",
    tags: ["UX", "Performance"],
    summary:
      "Field study on how operators actually use the interface once the network collapses.",
    body: `Took devices into the desert to test error budgets at single digit kbps. Captured the adjustments that made interfaces usable without animation or heavy assets.`,
  },
  {
    id: "IR-1042",
    slug: "analyst-enablement",
    directory: "intel",
    title: "Analyst Enablement Ops",
    classification: "SECRET",
    status: "DRAFT",
    owner: "Training Cell",
    updated: "2023-12-18T12:15:00Z",
    tags: ["Enablement", "Analytics"],
    summary:
      "Upcoming write-up on the analytics enablement path we used to onboard new analysts faster.",
    body: `Outline plus dataset packaging guidelines. Final draft scheduled after the next cohort graduates.`,
  },
  {
    id: "LG-7712",
    slug: "telemetry-hotfix",
    directory: "logs",
    title: "Telemetry Hotfix",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    owner: "Reliability Guild",
    updated: "2024-12-01T03:42:00Z",
    tags: ["Hotfix", "Sensors"],
    summary:
      "Patched a race condition that dropped 4% of packets during orbital hand-offs.",
    body: `Deployed a streaming hotfix and added invariant alerts for future releases.`,
  },
  {
    id: "LG-7602",
    slug: "casefile-scrub",
    directory: "logs",
    title: "Case File Scrub",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    owner: "Security Team",
    updated: "2024-09-27T18:30:00Z",
    tags: ["Security", "Compliance"],
    summary:
      "Audited dossier metadata for expired retention rules and purged six stale artifacts.",
    body: `Set up automation that flags orphaned assets, reducing manual review to minutes.`,
  },
  {
    id: "LG-7455",
    slug: "dash-refresh",
    directory: "logs",
    title: "Dash Refresh Deployment",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    owner: "Design Bureau",
    updated: "2024-07-05T15:00:00Z",
    tags: ["UI", "Polish"],
    summary:
      "Rolled out the classified dashboard refresh with zero downtime and no regression reports.",
    body: `Measured navigation success metrics and published the checklist for future pushes.`,
  },
  {
    id: "LG-7321",
    slug: "command-palette-alpha",
    directory: "logs",
    title: "Command Palette Alpha",
    classification: "CONFIDENTIAL",
    status: "ARCHIVED",
    owner: "Design Bureau",
    updated: "2024-04-28T22:10:00Z",
    tags: ["Keyboard", "Search"],
    summary:
      "Captured the alpha launch notes for the palette plus the issues triaged during testing.",
    body: `Most friction came from ambiguous verbs; resolved with scope hints beside each action.`,
  },
  {
    id: "LG-7105",
    slug: "infra-cutover",
    directory: "logs",
    title: "Infra Cutover",
    classification: "CONFIDENTIAL",
    status: "ARCHIVED",
    owner: "Platform",
    updated: "2023-12-03T09:15:00Z",
    tags: ["Platform", "Migration"],
    summary:
      "Documented the overnight cutover from the legacy stack to the mission ready build.",
    body: `Post-migration metrics and rollback plan summary.`,
  },
  {
    id: "CR-4100",
    slug: "skills-matrix",
    directory: "credentials",
    title: "Skills Matrix",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    owner: "Identity Desk",
    updated: "2024-10-14T10:05:00Z",
    tags: ["Resume", "Skills"],
    summary:
      "Structured view of primary competencies, depth, and recent missions where they were applied.",
    body: `Table-driven breakdown of capabilities across frontend, backend, infrastructure, and leadership lanes.`,
  },
  {
    id: "CR-4092",
    slug: "field-resume",
    directory: "credentials",
    title: "Field Resume Packet",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    owner: "Identity Desk",
    updated: "2024-08-02T17:00:00Z",
    tags: ["Resume", "PDF"],
    summary:
      "Printable resume packet with sanitized case file summaries and contact channels.",
    body: `Rendered as PDF plus MDX for quick edits.`,
  },
  {
    id: "CR-4020",
    slug: "comms-handshake",
    directory: "credentials",
    title: "Secure Comms Handshake",
    classification: "CONFIDENTIAL",
    status: "ACTIVE",
    owner: "Identity Desk",
    updated: "2024-03-18T09:30:00Z",
    tags: ["Contact", "Automation"],
    summary:
      "Describes the encrypted channels, auto-responders, and scheduling procedures.",
    body: `step-by-step instructions for contacting the team, plus fallback routes.`,
  },
  {
    id: "CR-3990",
    slug: "references-dossier",
    directory: "credentials",
    title: "References Dossier",
    classification: "CONFIDENTIAL",
    status: "DRAFT",
    owner: "Identity Desk",
    updated: "2023-11-05T12:00:00Z",
    tags: ["References"],
    summary:
      "Working file that aggregates speaking references and verification steps.",
    body: `Includes verification tokens and how to request time with each reference.`,
  },
] satisfies FileRecord[];

const filesByDirectorySeed: Record<DirectoryId, FileRecord[]> = {
  case: [],
  intel: [],
  logs: [],
  credentials: [],
};

for (const file of files) {
  filesByDirectorySeed[file.directory].push(file);
}

export const filesByDirectory = filesByDirectorySeed;

export const directoryCounts = Object.keys(filesByDirectorySeed).reduce(
  (acc, key) => {
    const directoryKey = key as DirectoryId;
    acc[directoryKey] = filesByDirectorySeed[directoryKey].length;
    return acc;
  },
  {} as Record<DirectoryId, number>,
);

export function isDirectoryId(value: string): value is DirectoryId {
  return (directories as Array<{ id: string }>).some(
    (directory) => directory.id === value,
  );
}

export function getFileBySlug(directory: DirectoryId, slug: string) {
  return filesByDirectory[directory].find((file) => file.slug === slug);
}

export function directoryRoute(directory: DirectoryId) {
  return directory === "case" ? "/dash" : `/files/${directory}`;
}

