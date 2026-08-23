import { PageSection } from "@/components/ui/PageSection";
import { site } from "@/content/site";

type ContactSectionProps = {
  title: string;
};

export function ContactSection({ title }: ContactSectionProps) {
  return (
    <PageSection id="contact" title={title}>
      <a
        className="inline-flex min-h-11 items-center self-start text-body text-trace underline underline-offset-4"
        href={`mailto:${site.email}`}
      >
        {site.email}
      </a>

      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {site.socialLinks.map((link) => (
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
