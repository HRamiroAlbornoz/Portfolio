import type { ReactNode } from "react";

import type { SectionId } from "@/lib/schemas";

type PageSectionProps = {
  children: ReactNode;
  id: SectionId;
  title: string;
};

export function PageSection({ children, id, title }: PageSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section
      aria-labelledby={titleId}
      className="flex scroll-mt-8 flex-col gap-8"
      id={id}
    >
      <h2 className="font-display text-title text-fore" id={titleId}>
        {title}
      </h2>

      {children}
    </section>
  );
}
