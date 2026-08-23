import { PageSection } from "@/components/ui/PageSection";
import { site } from "@/content/site";

type AboutSectionProps = {
  title: string;
};

export function AboutSection({ title }: AboutSectionProps) {
  return (
    <PageSection id="about" title={title}>
      {site.bio.map((paragraph) => (
        <p className="max-w-prose text-body text-muted" key={paragraph}>
          {paragraph}
        </p>
      ))}
    </PageSection>
  );
}
