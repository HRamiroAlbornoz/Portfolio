import { TraceRail } from "@/components/layout/TraceRail";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StackSection } from "@/components/sections/StackSection";
import { getContent } from "@/content";
import type { Locale } from "@/lib/locale";
import type { SectionId, Sections } from "@/lib/schemas";

function labelFor(sections: Sections, id: SectionId): string {
  return sections.find((section) => section.id === id)?.label ?? id;
}

type SiteHomeProps = {
  locale: Locale;
};

export function SiteHome({ locale }: SiteHomeProps) {
  const { education, projects, sections, site, stack, ui } =
    getContent(locale);

  return (
    <>
      <TraceRail label={ui.navigation.railLabel} sections={sections} />

      <main
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-20 px-6 py-24 focus-visible:outline-none"
        id="main-content"
        tabIndex={-1}
      >
        <HeroSection site={site} />

        <AboutSection
          paragraphs={site.bio}
          title={labelFor(sections, "about")}
        />

        <StackSection stack={stack} title={labelFor(sections, "stack")} />

        <ProjectsSection
          emptyLabel={ui.projects.empty}
          liveLabel={ui.projects.live}
          projects={projects}
          repositoryLabel={ui.projects.repository}
          title={labelFor(sections, "projects")}
        />

        <EducationSection
          entries={education}
          title={labelFor(sections, "education")}
        />

        <ContactSection
          email={site.email}
          socialLinks={site.socialLinks}
          title={labelFor(sections, "contact")}
        />
      </main>
    </>
  );
}
