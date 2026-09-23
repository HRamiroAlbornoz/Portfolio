import type { Site } from "@/lib/schemas";

type ResumeLinksProps = {
  resumes: Site["resumes"];
};

export function ResumeLinks({ resumes }: ResumeLinksProps) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {resumes.map((resume) => (
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
  );
}
