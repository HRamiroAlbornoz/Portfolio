import { PageSection } from "@/components/ui/PageSection";
import type { Site } from "@/lib/schemas";

type AboutSectionProps = {
  paragraphs: Site["bio"];
  title: string;
};

export function AboutSection({ paragraphs, title }: AboutSectionProps) {
  return (
    <PageSection id="about" title={title}>
      {paragraphs.map((paragraph) => (
        <p className="max-w-prose text-body text-muted" key={paragraph}>
          {paragraph}
        </p>
      ))}
    </PageSection>
  );
}
