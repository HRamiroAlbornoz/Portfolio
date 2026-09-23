import { Fragment, type ReactNode } from "react";

import { TraceRail } from "@/components/layout/TraceRail";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StackSection } from "@/components/sections/StackSection";
import { LanguageLink } from "@/components/ui/LanguageLink";
import { getContent } from "@/content";
import type { Locale } from "@/lib/locale";
import type { SectionId } from "@/lib/schemas";

type SiteHomeProps = {
  locale: Locale;
};

export function SiteHome({ locale }: SiteHomeProps) {
  const { education, projects, sections, site, stack, ui } =
    getContent(locale);

  const sectionRenderers: Record<SectionId, (title: string) => ReactNode> = {
    about: (title) => <AboutSection paragraphs={site.bio} title={title} />,
    stack: (title) => <StackSection stack={stack} title={title} />,
    projects: (title) => (
      <ProjectsSection
        emptyLabel={ui.projects.empty}
        liveLabel={ui.projects.live}
        projects={projects}
        repositoryLabel={ui.projects.repository}
        title={title}
      />
    ),
    education: (title) => (
      <EducationSection entries={education} title={title} />
    ),
    contact: (title) => (
      <ContactSection
        contactNote={site.contactNote}
        email={site.email}
        resumes={site.resumes}
        socialLinks={site.socialLinks}
        title={title}
      />
    ),
  };

  return (
    <>
      <TraceRail label={ui.navigation.railLabel} sections={sections} />

      <main
        className="flex w-full flex-1 flex-col gap-20 pb-24 focus-visible:outline-none"
        id="main-content"
        tabIndex={-1}
      >
        <HeroSection
          languageLink={<LanguageLink language={ui.language} />}
          notes={ui.hero.notes}
          site={site}
        />

        {sections.map((section) => (
          <Fragment key={section.id}>
            {sectionRenderers[section.id](section.label)}
          </Fragment>
        ))}
      </main>
    </>
  );
}
