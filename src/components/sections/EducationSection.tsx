import { PageSection } from "@/components/ui/PageSection";
import { education } from "@/content/education";

type EducationSectionProps = {
  title: string;
};

export function EducationSection({ title }: EducationSectionProps) {
  return (
    <PageSection id="education" title={title}>
      {education.map((entry) => (
        <article className="flex flex-col gap-3" key={entry.title}>
          <h3 className="font-display text-title text-fore">{entry.title}</h3>

          <p className="font-mono text-eyebrow uppercase text-muted">
            {entry.institution} · {entry.period}
          </p>

          <p className="max-w-prose text-body text-muted">{entry.summary}</p>

          <ul className="flex list-disc flex-col gap-1 pl-5 text-body text-muted">
            {entry.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      ))}
    </PageSection>
  );
}
