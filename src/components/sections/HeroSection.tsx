import type { ReactNode } from "react";

import { ResumeLinks } from "@/components/ui/ResumeLinks";
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

      <ResumeLinks resumes={site.resumes} />
    </header>
  );
}
