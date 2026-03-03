import Link from "next/link";

const skills = ["React", "JavaScript / TypeScript", "Python", "Flask", "Go"];

const projects = [
  {
    title: "Modern Reverse Proxy",
    description:
      "Go reverse proxy with atomic config swaps, zero-downtime deployments",
    tech: ["Go", "Server"],
    link: "https://github.com/C-NASIR/modern_reverse_proxy",
  },
  {
    title: "Distributed Rate Limiter",
    description:
      "service that you can run as a standalone binary and integrate with any system through HTTP or gRPC.",
    tech: ["GO", "HTTP", "gRPC"],
    link: "https://github.com/C-NASIR/distributed-rate-limiter",
  },
  {
    title: "AI Companion",
    description:
      "An event-driven “AI agent in a box” you can run locally: chat UI + FastAPI backend.",
    tech: ["Python", "AI"],
    link: "https://github.com/C-NASIR/AI-Companion",
  },
];

const playlists = [
  {
    title: "AI-Native Engineering",
    description: "how to build like a top AI-native engineer",
    link: "/coding.html",
  },
  {
    title: "CSS Course",
    description: "Master CSS from scratch",
    link: "https://www.youtube.com/playlist?list=PLdIF6sRfbwq60UMCrkPcMjmvghENQuiiF",
  },
  {
    title: "JavaScript & DOM Field Guide",
    description: "Master the javascrypt to control the web",
    link: "https://www.youtube.com/playlist?list=PLdIF6sRfbwq678_qutBn4JX3rBZnOAbOE",
  },
];

export function HomeProfile() {
  return (
    <div className="flex flex-col gap-8 px-4 py-8 text-green-50 sm:px-8 lg:px-12">
      <section className="grid gap-8 rounded-3xl border border-green-900/40 bg-gradient-to-br from-[#141414] via-[#0b0b0b] to-[#050505] p-8 shadow-2xl shadow-black/40 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.5em] text-green-400/80">
            San Francisco · Available worldwide
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-green-50 sm:text-5xl">
            Nasir — Software Engineer, Full Stack and Distributed Systems
          </h1>
          <p className="text-lg leading-relaxed text-green-100/85">
            I am a software engineer with almost four years of experience
            building production systems in Python, React, and Go. My work spans
            APIs, mobile apps, data-intensive services, and advanced frontend
            visualization, including large-scale interactive mapping software
            built with DeckGL and Google Maps.
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge>Full-Stack Expertise</Badge>
            <Badge>Systems Storytelling</Badge>
            <Badge>Human-Calmed Interfaces</Badge>
          </div>
          <div className="flex flex-wrap gap-4">
            <PrimaryLink href="https://www.linkedin.com/in/cnasir2/">
              LinkedIn
            </PrimaryLink>
            <PrimaryLink href="https://github.com/C-NASIR">GitHub</PrimaryLink>
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-green-900/50 bg-black/40 p-6 text-sm uppercase tracking-[0.35em] text-green-200">
          <p className="text-green-500/80">Signal Snapshot</p>
          <SnapshotItem label="Core Stack">
            React · Node · Python · Go
          </SnapshotItem>
          <SnapshotItem label="Currently Learning">
            Distributed systems design & tracing
          </SnapshotItem>
          <SnapshotItem label="Operating Mode">
            Calm under pressure, narrative-first updates
          </SnapshotItem>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-green-900/40 bg-[#0b0b0b] p-8 shadow-inner shadow-black/30 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-green-50">Expertise</h2>
          <p className="mt-3 text-base leading-relaxed text-green-100/85">
            Before engineering, I worked as a medical interpreter and a school
            tutor, where I learned how to translate complex information into
            clear and simple language. That experience still shapes how I
            approach system design, documentation, and explaining technical
            trade-offs to non-technical audiences.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-green-200/90">
            <ListItem>
              Designing real-time UIs that feel composed even under load
            </ListItem>
            <ListItem>
              Running ops-ready code reviews and incident retros with precision
            </ListItem>
            <ListItem>
              Mentoring engineers on narrative comms and technical storytelling
            </ListItem>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-green-50">
            Primary Skills
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-green-900/40 bg-[#080808] p-8 shadow-2xl shadow-black/30">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.5em] text-green-500/80">
              Builds & Stories
            </p>
            <h2 className="text-3xl font-semibold text-green-50">
              Selected Projects
            </h2>
          </div>
          <PrimaryLink href="#">View Case Studies</PrimaryLink>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <article
              className="space-y-4 rounded-2xl border border-green-900/40 bg-black/40 p-6 text-green-100"
              key={project.title}
            >
              <h3 className="text-xl font-semibold text-green-50">
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed text-green-200/90">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-green-300/80">
                {project.tech.map((tech) => (
                  <span
                    className="rounded-full border border-green-800/50 px-2 py-1"
                    key={tech}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <Link
                className="text-sm uppercase tracking-[0.3em] text-green-300 hover:text-green-50"
                href={project.link}
                target="blank"
              >
                View dossier →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-green-900/40 bg-[#0c0c0c] p-8 shadow-inner shadow-black/30 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="text-2xl font-semibold text-green-50">
            Teaching Signal
          </h2>
          <p className="mt-2 text-sm text-green-200/90">
            I publish some useful things for engineers
          </p>
          <div className="mt-6 space-y-4">
            {playlists.map((playlist) => (
              <article
                className="rounded-2xl border border-green-900/40 bg-black/40 p-5"
                key={playlist.title}
              >
                <h3 className="text-lg font-semibold text-green-50">
                  {playlist.title}
                </h3>
                <p className="mt-1 text-sm text-green-200/80">
                  {playlist.description}
                </p>
                <Link
                  className="mt-3 inline-flex text-xs uppercase tracking-[0.35em] text-green-300 hover:text-green-50"
                  href={playlist.link}
                  target="blank"
                >
                  Watch playlist →
                </Link>
              </article>
            ))}
          </div>
        </div>
        <div className="space-y-5 rounded-2xl border border-green-900/40 bg-black/30 p-6 text-sm text-green-100">
          <h2 className="text-xl font-semibold text-green-50">Current Focus</h2>
          <p className="text-green-200/80">
            Deep-diving into distributed systems fundamentals: state machines,
            consensus, and observability that tells the truth.
          </p>
          <ul className="space-y-2 text-green-300/80">
            <ListItem>Design reviews for event-driven architectures</ListItem>
            <ListItem>Tracing pipelines with deterministic replay</ListItem>
            <ListItem>Writing about “calm ops” delivery rituals</ListItem>
          </ul>
        </div>
      </section>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-green-700/50 bg-black/40 px-4 py-1 text-xs uppercase tracking-[0.4em] text-green-200">
      {children}
    </span>
  );
}

function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      className="rounded-full border border-green-500/70 bg-black/50 px-5 py-2 text-xs uppercase tracking-[0.4em] text-green-50 transition hover:border-green-300 hover:text-green-100"
      href={href}
      target="blank"
    >
      {children}
    </Link>
  );
}

function SnapshotItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1 text-sm normal-case tracking-normal">
      <p className="text-[0.55rem] uppercase tracking-[0.35em] text-green-500/70">
        {label}
      </p>
      <p>{children}</p>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        aria-hidden
        className="mt-1 h-1.5 w-1.5 rounded-full bg-green-400"
      />
      <span>{children}</span>
    </li>
  );
}

export default HomeProfile;
