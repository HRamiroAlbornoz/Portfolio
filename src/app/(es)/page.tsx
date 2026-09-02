import type { Metadata } from "next";

import { TraceRail } from "@/components/layout/TraceRail";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StackSection } from "@/components/sections/StackSection";
import { sections } from "@/content/sections";
import { ui } from "@/content/ui";
import type { SectionId } from "@/lib/schemas";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

function labelFor(id: SectionId): string {
  return sections.find((section) => section.id === id)?.label ?? id;
}

export default function HomePage() {
  return (
    <>
      <TraceRail label={ui.navigation.railLabel} sections={sections} />

      <main
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-20 px-6 py-24 focus-visible:outline-none"
        id="main-content"
        tabIndex={-1}
      >
        <HeroSection />

        <AboutSection title={labelFor("about")} />

        <StackSection title={labelFor("stack")} />

        <ProjectsSection
          emptyLabel={ui.projects.empty}
          liveLabel={ui.projects.live}
          repositoryLabel={ui.projects.repository}
          title={labelFor("projects")}
        />

        <EducationSection title={labelFor("education")} />

        <ContactSection title={labelFor("contact")} />
      </main>
    </>
  );
}
