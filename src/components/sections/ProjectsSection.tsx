import Image from "next/image";

import { PageSection } from "@/components/ui/PageSection";
import { projects } from "@/content/projects";

type ProjectsSectionProps = {
  emptyLabel: string;
  liveLabel: string;
  repositoryLabel: string;
  title: string;
};

export function ProjectsSection({
  emptyLabel,
  liveLabel,
  repositoryLabel,
  title,
}: ProjectsSectionProps) {
  if (projects.length === 0) {
    return (
      <PageSection id="projects" title={title}>
        <p className="flex items-center gap-4 font-mono text-eyebrow uppercase text-pending">
          <span
            aria-hidden="true"
            className="size-[11px] shrink-0 rounded-full border border-dashed border-pending"
          />
          {emptyLabel}
        </p>
      </PageSection>
    );
  }

  return (
    <PageSection id="projects" title={title}>
      <ol className="flex flex-col gap-6">
        {projects.map((project) => (
          <li
            className="flex flex-col gap-4 rounded-lg border border-line bg-surface p-6 sm:p-8"
            key={project.slug}
          >
            <h3 className="font-display text-subtitle text-fore">
              {project.name}
            </h3>

            <p className="font-mono text-eyebrow uppercase text-pending">
              {project.role} · {project.year}
            </p>

            {project.image !== undefined && (
              <div className="relative aspect-video w-full overflow-hidden rounded border border-line bg-ink">
                <Image
                  alt={project.image.alt}
                  className="object-cover"
                  fill
                  sizes="(min-width: 48rem) 45rem, calc(100vw - 3rem)"
                  src={project.image.src}
                />
              </div>
            )}

            <p className="max-w-prose text-body text-muted">
              {project.summary}
            </p>

            <ul className="flex list-disc flex-col gap-1 pl-5 text-body text-muted">
              {project.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-eyebrow uppercase text-muted">
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>

            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {project.repositoryUrl !== undefined && (
                <li>
                  <a
                    className="inline-flex min-h-11 items-center font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
                    href={project.repositoryUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {repositoryLabel}
                    <span className="sr-only"> {project.name}</span>
                  </a>
                </li>
              )}

              {project.liveUrl !== undefined && (
                <li>
                  <a
                    className="inline-flex min-h-11 items-center font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
                    href={project.liveUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {liveLabel}
                    <span className="sr-only"> {project.name}</span>
                  </a>
                </li>
              )}
            </ul>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}
