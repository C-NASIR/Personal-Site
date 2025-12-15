export type SkillLevel = "Working" | "Strong" | "Advanced";

export type SkillEvidence = {
  name: string;
  level: SkillLevel;
  evidence: string;
  links?: { label: string; href: string }[];
};

export type SkillCategory = {
  title: string;
  description?: string;
  skills: SkillEvidence[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Systems",
    description: "Design systems, data-heavy dashboards, accessibility",
    skills: [
      {
        name: "Next.js / React",
        level: "Advanced",
        evidence:
          "Shipped classified-style dashboards with App Router, streaming data, and offline-safe states across desktop and tablet.",
        links: [{ label: "Orbital Console", href: "/files/case/realtime-dashboard" }],
      },
      {
        name: "TypeScript",
        level: "Advanced",
        evidence:
          "Author of shared platform types, strict lint configs, and ergonomic component APIs for 30+ devs.",
      },
      {
        name: "Accessibility",
        level: "Strong",
        evidence:
          "Command palettes, search inputs, and log tables all accessible by keyboard with screen-reader labels.",
      },
    ],
  },
  {
    title: "Backend & Distributed",
    description: "APIs, orchestration, data reliability",
    skills: [
      {
        name: "Node / GraphQL",
        level: "Advanced",
        evidence:
          "Shipped typed GraphQL gateways with deterministic workflows and streaming resolvers for orbital commerce stack.",
      },
      {
        name: "Rust",
        level: "Strong",
        evidence:
          "Built sidecars for zero-trust identity mesh handling attestations at 12k claims/sec.",
      },
      {
        name: "Event-driven workflows",
        level: "Strong",
        evidence:
          "Designed Temporal + queue orchestrations with idempotent replay and audit-friendly state machines.",
      },
    ],
  },
  {
    title: "Cloud & Infra",
    skills: [
      {
        name: "AWS",
        level: "Strong",
        evidence: "Own multi-account IaC pipelines, built hardened VPC migrations, and wrote cutover playbooks.",
      },
      {
        name: "Terraform",
        level: "Working",
        evidence: "Maintain reusable modules for secure networking, logging, and telemetry collectors.",
      },
      {
        name: "Observability",
        level: "Advanced",
        evidence:
          "Instrumented streaming dashboards and chaos drills so leadership can grade incidents live.",
      },
    ],
  },
  {
    title: "Systems & Communication",
    skills: [
      {
        name: "System design",
        level: "Advanced",
        evidence:
          "Published dossiers that show architecture, trade-offs, and blast radius clearly enough for exec reviews.",
        links: [{ label: "Sovereign Identity", href: "/files/case/distributed-kv-store" }],
      },
      {
        name: "Enablement",
        level: "Strong",
        evidence:
          "Run lab days with operators, capture evidence, and turn findings into backlog-ready specs.",
      },
      {
        name: "Leadership comms",
        level: "Strong",
        evidence:
          "Write Intel reports and activity logs that keep directors aligned on trade-offs and delivery status.",
      },
    ],
  },
];
