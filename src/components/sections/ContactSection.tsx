import { PageSection } from "@/components/ui/PageSection";
import { ResumeLinks } from "@/components/ui/ResumeLinks";
import type { Site } from "@/lib/schemas";

type ContactSectionProps = {
  contactNote: Site["contactNote"];
  email: Site["email"];
  resumes: Site["resumes"];
  socialLinks: Site["socialLinks"];
  title: string;
};

export function ContactSection({
  contactNote,
  email,
  resumes,
  socialLinks,
  title,
}: ContactSectionProps) {
  return (
    <PageSection id="contact" title={title}>
      <div className="flex flex-col gap-2">
        <a
          className="inline-flex min-h-11 items-center self-start font-display text-subtitle text-trace underline underline-offset-4"
          href={`mailto:${email}`}
        >
          {email}
        </a>

        <p className="text-body text-muted">{contactNote}</p>
      </div>

      <ResumeLinks resumes={resumes} />

      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {socialLinks.map((link) => (
          <li key={link.url}>
            <a
              className="inline-flex min-h-11 items-center font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
              href={link.url}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </PageSection>
  );
}
