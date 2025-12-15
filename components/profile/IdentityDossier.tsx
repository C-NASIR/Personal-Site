import { MDXRemote } from "next-mdx-remote/rsc";

import type { IdentityProfile } from "@/lib/profile";

import { mdxComponents } from "../dossier/mdxComponents";

type IdentityDossierProps = {
  profile: IdentityProfile;
};

export function IdentityDossier({ profile }: IdentityDossierProps) {
  return (
    <article className="grid gap-6 rounded border border-green-900/40 bg-black/50 p-6 text-green-100 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div>
        <div className="border-b border-green-900/30 pb-4">
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-green-500/70">
            Identity Profile · {profile.classification}
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-green-50">
            {profile.name}
          </h1>
          <p className="mt-1 text-sm text-green-200/90">{profile.summary}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs uppercase tracking-[0.35em] text-green-400/80">
            <span>Dossier {profile.dossierId}</span>
            <span>Updated {new Date(profile.updatedAt).toLocaleDateString()}</span>
            <span>Session {profile.sessionId}</span>
          </div>
        </div>
        <div className="prose prose-invert mt-6 max-w-none">
          <MDXRemote source={profile.mdx} components={mdxComponents} />
        </div>
      </div>
      <aside className="space-y-4 rounded border border-green-900/40 bg-black/60 p-4 text-sm text-green-100">
        <QuickFact label="Current Role">{profile.role}</QuickFact>
        <QuickFact label="Mission">{profile.missionTag}</QuickFact>
        <QuickFact label="Location">{profile.location}</QuickFact>
        <QuickFact label="Target Roles">
          <ul className="space-y-1 text-green-100/90">
            {profile.targetRoles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </QuickFact>
        <QuickFact label="Primary Stack">
          <div className="flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-green-200">
            {profile.primaryStack.map((item) => (
              <span
                className="rounded border border-green-800/40 px-2 py-1"
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
        </QuickFact>
        <QuickFact label="Contact">{profile.contactHandle}</QuickFact>
      </aside>
    </article>
  );
}

type QuickFactProps = {
  label: string;
  children: React.ReactNode;
};

function QuickFact({ label, children }: QuickFactProps) {
  return (
    <div className="space-y-1 border border-green-900/30 bg-black/40 px-3 py-2">
      <p className="text-[0.6rem] uppercase tracking-[0.4em] text-green-500/70">
        {label}
      </p>
      <div className="text-green-50">{children}</div>
    </div>
  );
}

export default IdentityDossier;

