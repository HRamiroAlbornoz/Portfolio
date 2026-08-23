import { education } from "@/content/education";
import { projects } from "@/content/projects";
import { sections } from "@/content/sections";
import { site } from "@/content/site";
import { stack } from "@/content/stack";
import type { SectionId } from "@/lib/schemas";

function labelFor(id: SectionId): string {
  return sections.find((section) => section.id === id)?.label ?? id;
}

export default function HomePage() {
  return (
    <main id="main-content" className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-16 px-6 py-24">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-eyebrow uppercase text-trace">
          {site.availability}
        </p>

        <h1 className="font-display text-display text-fore">{site.name}</h1>

        <p className="font-display text-title text-muted">{site.role}</p>

        <p className="max-w-prose text-body text-fore">{site.tagline}</p>

        <p className="font-mono text-eyebrow uppercase text-muted">
          {site.location} · {site.languages}
        </p>

        <ul className="flex flex-wrap gap-4">
          {site.resumes.map((resume) => (
            <li key={resume.language}>
              <a
                className="font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
                href={resume.path}
                hrefLang={resume.language}
                download
              >
                CV · {resume.label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <section id="about" aria-labelledby="about-title" className="flex flex-col gap-4">
        <h2 id="about-title" className="font-display text-title text-fore">
          {labelFor("about")}
        </h2>
        {site.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="max-w-prose text-body text-muted">
            {paragraph}
          </p>
        ))}
      </section>

      <section id="stack" aria-labelledby="stack-title" className="flex flex-col gap-6">
        <h2 id="stack-title" className="font-display text-title text-fore">
          {labelFor("stack")}
        </h2>
        {stack.map((layer) => (
          <div key={layer.id} className="flex flex-col gap-2">
            <h3 className="font-mono text-eyebrow uppercase text-trace">
              {layer.label}
            </h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-body text-muted">
              {layer.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section
        id="projects"
        aria-labelledby="projects-title"
        className="flex flex-col gap-8"
      >
        <h2 id="projects-title" className="font-display text-title text-fore">
          {labelFor("projects")}
        </h2>

        {projects.length === 0 ? (
          <p className="font-mono text-eyebrow uppercase text-pending">
            Todavía sin desplegar
          </p>
        ) : (
          <ul className="flex flex-col gap-10">
            {projects.map((project) => (
              <li key={project.slug} className="flex flex-col gap-3">
                <h3 className="font-display text-title text-fore">
                  {project.name}
                </h3>
                <p className="font-mono text-eyebrow uppercase text-muted">
                  {project.role} · {project.year}
                </p>
                <p className="max-w-prose text-body text-muted">
                  {project.summary}
                </p>
                <ul className="flex list-disc flex-col gap-1 pl-5 text-body text-muted">
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-eyebrow uppercase text-muted">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
                <ul className="flex flex-wrap gap-4">
                  {project.repositoryUrl !== undefined && (
                    <li>
                      <a
                        className="font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Código
                      </a>
                    </li>
                  )}
                  {project.liveUrl !== undefined && (
                    <li>
                      <a
                        className="font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Ver en vivo
                      </a>
                    </li>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        id="education"
        aria-labelledby="education-title"
        className="flex flex-col gap-6"
      >
        <h2 id="education-title" className="font-display text-title text-fore">
          {labelFor("education")}
        </h2>
        {education.map((entry) => (
          <div key={entry.title} className="flex flex-col gap-2">
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
          </div>
        ))}
      </section>

      <section
        id="contact"
        aria-labelledby="contact-title"
        className="flex flex-col gap-4"
      >
        <h2 id="contact-title" className="font-display text-title text-fore">
          {labelFor("contact")}
        </h2>
        <a
          className="text-body text-trace underline underline-offset-4"
          href={`mailto:${site.email}`}
        >
          {site.email}
        </a>
        <ul className="flex flex-wrap gap-4">
          {site.socialLinks.map((link) => (
            <li key={link.url}>
              <a
                className="font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
