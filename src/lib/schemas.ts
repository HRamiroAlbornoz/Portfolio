import { z } from "zod";

import { TECHNOLOGY_ICON_NAMES } from "@/lib/icons";
import { LOCALES } from "@/lib/locale";

const MAX_LABEL_LENGTH = 48;
const MAX_HEADLINE_LENGTH = 140;
const MAX_PARAGRAPH_LENGTH = 700;
const MAX_BIO_PARAGRAPHS = 4;
const MAX_ITEMS_PER_LAYER = 14;
const MAX_HIGHLIGHTS_PER_ENTRY = 5;
const MAX_HIGHLIGHTS_PER_PROJECT = 3;
const MAX_TECHNOLOGIES_PER_PROJECT = 12;
const EARLIEST_PROJECT_YEAR = 2020;
const LATEST_PROJECT_YEAR = 2100;

const label = z.string().trim().min(1).max(MAX_LABEL_LENGTH);
const headline = z.string().trim().min(1).max(MAX_HEADLINE_LENGTH);
const paragraph = z.string().trim().min(1).max(MAX_PARAGRAPH_LENGTH);
const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usá solo minúsculas, números y guiones");

const hasUniqueValues = <T>(values: readonly T[]): boolean =>
  new Set(values).size === values.length;

export const sectionIdSchema = z.enum([
  "about",
  "stack",
  "projects",
  "education",
  "contact",
]);

export const sectionSchema = z.object({
  id: sectionIdSchema,
  label,
});

export const sectionsSchema = z
  .array(sectionSchema)
  .min(1)
  .refine(
    (sections) => hasUniqueValues(sections.map((section) => section.id)),
    "Hay dos secciones con el mismo id",
  );

export const socialLinkSchema = z.object({
  label,
  url: z.httpUrl(),
});

const internalPdfPath = z
  .string()
  .trim()
  .regex(
    /^\/[A-Za-z0-9][A-Za-z0-9._~\-/]*\.pdf$/,
    "Usá una ruta interna del sitio que empiece con una sola barra y termine en .pdf",
  )
  .refine(
    (path) => !path.split("/").includes(".."),
    "La ruta no puede contener segmentos '..'",
  );

const internalImagePath = z
  .string()
  .trim()
  .regex(
    /^\/[A-Za-z0-9][A-Za-z0-9._~\-/]*\.(avif|jpeg|jpg|png|webp)$/,
    "Usá una ruta interna del sitio que empiece con una sola barra y termine en una imagen",
  )
  .refine(
    (path) => !path.split("/").includes(".."),
    "La ruta no puede contener segmentos '..'",
  );

export const projectImageSchema = z.object({
  src: internalImagePath,
  alt: headline,
});

export const resumeSchema = z.object({
  label,
  language: z.enum(LOCALES),
  path: internalPdfPath,
});

export const siteSchema = z.object({
  name: headline,
  role: headline,
  tagline: headline,
  location: label,
  availability: label,
  languages: label,
  email: z.email(),
  bio: z.array(paragraph).min(1).max(MAX_BIO_PARAGRAPHS),
  socialLinks: z.array(socialLinkSchema).min(1),
  resumes: z
    .array(resumeSchema)
    .min(1)
    .refine(
      (resumes) => hasUniqueValues(resumes.map((resume) => resume.language)),
      "Hay dos versiones del CV en el mismo idioma",
    ),
});

export const uiSchema = z.object({
  navigation: z.object({
    railLabel: label,
    skipLabel: label,
  }),
  language: z.object({
    code: z.enum(LOCALES),
    label: label,
    description: label,
  }),
  notFound: z.object({
    code: label,
    title: headline,
    description: paragraph,
    homeLabel: label,
  }),
  footer: z.object({
    note: headline,
    sourceLabel: label,
    sourceUrl: z.httpUrl(),
  }),
  projects: z.object({
    empty: label,
    live: label,
    repository: label,
  }),
  theme: z.object({
    groupLabel: label,
    options: z.object({
      system: label,
      light: label,
      dark: label,
    }),
  }),
});

export const stackLayerIdSchema = z.enum([
  "interface",
  "logic",
  "data",
  "tooling",
]);

export const stackItemSchema = z.object({
  name: label,
  icon: z
    .string()
    .refine(
      (value) => TECHNOLOGY_ICON_NAMES.includes(value),
      "Ese icono no existe en src/lib/icons.ts",
    )
    .optional(),
});

export const stackLayerSchema = z.object({
  id: stackLayerIdSchema,
  label,
  items: z.array(stackItemSchema).min(1).max(MAX_ITEMS_PER_LAYER),
});

export const stackSchema = z
  .array(stackLayerSchema)
  .min(1)
  .refine(
    (layers) => hasUniqueValues(layers.map((layer) => layer.id)),
    "Hay dos capas del stack con el mismo id",
  );

export const educationEntrySchema = z.object({
  title: headline,
  institution: label,
  period: label,
  summary: paragraph,
  highlights: z.array(headline).max(MAX_HIGHLIGHTS_PER_ENTRY),
});

export const educationSchema = z.array(educationEntrySchema).min(1);

export const projectSchema = z.object({
  slug,
  name: headline,
  role: headline,
  summary: paragraph,
  year: z.number().int().min(EARLIEST_PROJECT_YEAR).max(LATEST_PROJECT_YEAR),
  highlights: z.array(headline).max(MAX_HIGHLIGHTS_PER_PROJECT),
  technologies: z.array(label).min(1).max(MAX_TECHNOLOGIES_PER_PROJECT),
  image: projectImageSchema.optional(),
  repositoryUrl: z.httpUrl().optional(),
  liveUrl: z.httpUrl().optional(),
});

export const projectsSchema = z
  .array(projectSchema)
  .refine(
    (projects) => hasUniqueValues(projects.map((project) => project.slug)),
    "Hay dos proyectos con el mismo slug",
  );

export type SectionId = z.infer<typeof sectionIdSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type Sections = z.infer<typeof sectionsSchema>;
export type Stack = z.infer<typeof stackSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Projects = z.infer<typeof projectsSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type Site = z.infer<typeof siteSchema>;
export type Ui = z.infer<typeof uiSchema>;
export type StackLayerId = z.infer<typeof stackLayerIdSchema>;
export type StackItem = z.infer<typeof stackItemSchema>;
export type StackLayer = z.infer<typeof stackLayerSchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type ProjectImage = z.infer<typeof projectImageSchema>;
export type Project = z.infer<typeof projectSchema>;
