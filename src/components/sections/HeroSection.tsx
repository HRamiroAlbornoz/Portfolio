import { site } from "@/content/site";

export function HeroSection() {
  return (
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
