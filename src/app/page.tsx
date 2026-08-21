import { sections } from "@/content/sections";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-24">
      <p className="font-mono text-eyebrow uppercase text-trace">
        {site.availability}
      </p>

      <h1 className="mt-6 font-display text-display text-fore">{site.name}</h1>

      <p className="mt-4 font-display text-title text-muted">{site.role}</p>

      <p className="mt-8 max-w-prose text-body text-muted">{site.tagline}</p>

      <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 font-mono text-eyebrow uppercase text-muted">
        {sections.map((section) => (
          <li key={section.id}>{section.label}</li>
        ))}
      </ul>
    </main>
  );
}
