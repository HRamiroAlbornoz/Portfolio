import type { ReactNode } from "react";

import { ResumeLinks } from "@/components/ui/ResumeLinks";
import type { Site, Ui } from "@/lib/schemas";

const NO_BREAK_SPACE = String.fromCharCode(0xa0);
const SEPARATOR = " · ";
const ATTACHED_SEPARATOR = `${NO_BREAK_SPACE}· `;

const STEP_ALIGNMENT = {
  text: { note: "pt-1", node: "mt-1", tick: "top-[9px]" },
  control: { note: "pt-4", node: "mt-4", tick: "top-[21px]" },
};

type HeroStepProps = {
  align?: keyof typeof STEP_ALIGNMENT;
  children: ReactNode;
  delay: string;
  note: string;
};

function HeroStep({ align = "text", children, delay, note }: HeroStepProps) {
  const alignment = STEP_ALIGNMENT[align];

  return (
    <>
      <span
        aria-hidden="true"
        className={`hidden justify-self-end font-mono text-eyebrow uppercase text-pending sm:block ${alignment.note}`}
      >
        {note}
      </span>

      <span aria-hidden="true" className="relative">
        <span
          className={`absolute top-0 -bottom-4 left-[5px] w-px origin-top animate-trace-draw bg-trace sm:-bottom-7 ${delay}`}
        />
        <span
          className={`absolute left-[11px] h-px w-4 origin-left animate-trace-node bg-trace ${alignment.tick} ${delay}`}
        />
        <span
          className={`relative block size-[11px] animate-trace-node rounded-full border border-trace bg-ink ${alignment.node} ${delay}`}
        />
      </span>

      <div className="min-w-0">{children}</div>
    </>
  );
}

type HeroSectionProps = {
  languageLink: ReactNode;
  notes: Ui["hero"]["notes"];
  site: Site;
};

export function HeroSection({ languageLink, notes, site }: HeroSectionProps) {
  const whereLine = [site.location, site.languages]
    .join(SEPARATOR)
    .replaceAll(SEPARATOR, ATTACHED_SEPARATOR);

  return (
    <header className="relative mx-auto flex min-h-[calc(100svh-var(--header-height))] w-full max-w-3xl flex-col gap-6 px-6 pt-6 sm:pt-12">
      <div className="absolute top-6 right-6 z-10 sm:static sm:flex sm:justify-end">
        {languageLink}
      </div>

      <div className="grid flex-1 grid-cols-[11px_minmax(0,1fr)] grid-rows-[repeat(5,auto)_1fr] gap-x-4 gap-y-3 sm:grid-cols-[7rem_11px_minmax(0,1fr)] sm:gap-y-6 xl:-ml-[calc(9rem+11px)]">
        <HeroStep delay="[animation-delay:0ms]" note={notes.who}>
          <h1 className="font-display text-display text-fore">{site.name}</h1>
        </HeroStep>

        <HeroStep delay="[animation-delay:150ms]" note={notes.what}>
          <div className="flex flex-col gap-4">
            <p className="font-display text-title text-muted">{site.role}</p>
            <p className="max-w-prose text-body text-fore">{site.tagline}</p>
          </div>
        </HeroStep>

        <HeroStep delay="[animation-delay:300ms]" note={notes.availability}>
          <p className="font-mono text-eyebrow leading-tight uppercase text-fore">
            {site.availability}
          </p>
        </HeroStep>

        <HeroStep delay="[animation-delay:450ms]" note={notes.where}>
          <p className="font-mono text-eyebrow leading-tight uppercase text-muted">
            {whereLine}
          </p>
        </HeroStep>

        <HeroStep
          align="control"
          delay="[animation-delay:600ms]"
          note={notes.resumes}
        >
          <ResumeLinks resumes={site.resumes} />
        </HeroStep>

        <span
          aria-hidden="true"
          className="col-start-1 row-start-6 ml-[5px] w-px origin-top animate-trace-draw bg-trace [animation-delay:750ms] sm:col-start-2"
        />
      </div>
    </header>
  );
}
