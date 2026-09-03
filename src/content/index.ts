import "server-only";

import type {
  Education,
  Projects,
  Sections,
  Site,
  Stack,
  Ui,
} from "@/lib/schemas";
import { LOCALES, type Locale } from "@/lib/locale";

import { education as educationEn } from "./en/education";
import { projects as projectsEn } from "./en/projects";
import { sections as sectionsEn } from "./en/sections";
import { site as siteEn } from "./en/site";
import { stack as stackEn } from "./en/stack";
import { ui as uiEn } from "./en/ui";
import { education as educationEs } from "./es/education";
import { projects as projectsEs } from "./es/projects";
import { sections as sectionsEs } from "./es/sections";
import { site as siteEs } from "./es/site";
import { stack as stackEs } from "./es/stack";
import { ui as uiEs } from "./es/ui";

export type Content = {
  education: Education;
  projects: Projects;
  sections: Sections;
  site: Site;
  stack: Stack;
  ui: Ui;
};

const CONTENT: Record<Locale, Content> = {
  es: {
    education: educationEs,
    projects: projectsEs,
    sections: sectionsEs,
    site: siteEs,
    stack: stackEs,
    ui: uiEs,
  },
  en: {
    education: educationEn,
    projects: projectsEn,
    sections: sectionsEn,
    site: siteEn,
    stack: stackEn,
    ui: uiEn,
  },
};

function assertSameKeys(
  field: string,
  read: (content: Content) => readonly string[],
): void {
  const [reference, ...others] = LOCALES.map((locale) => ({
    locale,
    keys: read(CONTENT[locale]).join(","),
  }));

  if (reference === undefined) {
    return;
  }

  for (const other of others) {
    if (other.keys !== reference.keys) {
      throw new Error(
        `El contenido de "${other.locale}" y "${reference.locale}" no coincide en ${field}: ` +
          `[${other.keys}] contra [${reference.keys}]. ` +
          "Las claves estructurales tienen que ser las mismas en todos los idiomas.",
      );
    }
  }
}

assertSameKeys("los identificadores de sección", (content) =>
  content.sections.map((section) => section.id),
);

assertSameKeys("los identificadores de capa del stack", (content) =>
  content.stack.map((layer) => layer.id),
);

assertSameKeys("los slugs de proyecto", (content) =>
  content.projects.map((project) => project.slug),
);

for (const locale of LOCALES) {
  if (CONTENT[locale].ui.language.code === locale) {
    throw new Error(
      `El selector de idioma de "${locale}" apunta a su propio idioma. ` +
        "El campo ui.language.code tiene que nombrar el idioma de destino, no el actual.",
    );
  }
}

export function getContent(locale: Locale): Content {
  return CONTENT[locale];
}
