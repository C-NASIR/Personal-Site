import type { SkillCategory, SkillEvidence } from "@/content/profile/skills";

const LEVEL_ORDER: Record<SkillEvidence["level"], number> = {
  Advanced: 1,
  Strong: 2,
  Working: 3,
};

type SkillsMatrixProps = {
  categories: SkillCategory[];
};

export function SkillsMatrix({ categories }: SkillsMatrixProps) {
  return (
    <section id="skills" className="space-y-4">
      <header>
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-green-500/70">
          Skills Matrix
        </p>
        <h2 className="text-2xl font-semibold text-green-50">
          Honest signal over buzzwords.
        </h2>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <div
            className="flex h-full flex-col rounded border border-green-900/40 bg-black/60 p-4"
            key={category.title}
          >
            <div className="border-b border-green-900/30 pb-3">
              <p className="text-xs uppercase tracking-[0.35em] text-green-400/80">
                {category.title}
              </p>
              {category.description ? (
                <p className="text-sm text-green-200/80">{category.description}</p>
              ) : null}
            </div>
            <ul className="mt-3 space-y-3">
              {category.skills
                .slice()
                .sort(
                  (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level],
                )
                .map((skill) => (
                  <li key={skill.name}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{skill.name}</span>
                      <span className="rounded border border-green-700/50 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.3em] text-green-200">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-sm text-green-200/80">{skill.evidence}</p>
                    {skill.links?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {skill.links.map((link) => (
                          <a
                            className="rounded border border-green-700/40 px-2 py-1 uppercase tracking-[0.3em] text-green-200 hover:border-green-400"
                            href={link.href}
                            key={link.href}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SkillsMatrix;

