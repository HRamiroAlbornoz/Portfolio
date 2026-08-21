import { z } from "zod";

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

export const resumeSchema = z.object({
  label,
  language: z.enum(["es", "en"]),
  path: z.string().trim().startsWith("/").endsWith(".pdf"),
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

export const stackLayerIdSchema = z.enum([
  "interface",
  "logic",
  "data",
  "tooling",
]);

export const stackLayerSchema = z.object({
  id: stackLayerIdSchema,
  label,
  items: z.array(label).min(1).max(MAX_ITEMS_PER_LAYER),
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
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type Site = z.infer<typeof siteSchema>;
export type StackLayerId = z.infer<typeof stackLayerIdSchema>;
export type StackLayer = z.infer<typeof stackLayerSchema>;
export type EducationEntry = z.infer<typeof educationEntrySchema>;
export type Project = z.infer<typeof projectSchema>;
