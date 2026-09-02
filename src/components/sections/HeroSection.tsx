import type { ReactNode } from "react";

import type { Site } from "@/lib/schemas";

type HeroSectionProps = {
  languageLink: ReactNode;
  site: Site;
};

export function HeroSection({ languageLink, site }: HeroSectionProps) {
  return (
    <header className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-eyebrow uppercase text-trace">
          {site.availability}
        </p>

        {languageLink}
      </div>

      <h1 className="font-display text-display text-fore">{site.name}</h1>

      <p className="font-display text-title text-muted">{site.role}</p>

      <p className="max-w-prose text-body text-fore">{site.tagline}</p>

      <p className="font-mono text-eyebrow uppercase text-muted">
        {site.location} · {site.languages}
      </p>

      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {site.resumes.map((resume) => (
          <li key={resume.language}>
            <a
              className="inline-flex min-h-11 items-center font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
              download
              href={resume.path}
              hrefLang={resume.language}
            >
              CV · {resume.label}
            </a>
          </li>
        ))}
      </ul>
    </header>
  );
}
