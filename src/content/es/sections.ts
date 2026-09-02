import type { z } from "zod";

import { sectionsSchema } from "@/lib/schemas";

export const sections = sectionsSchema.parse([
  { id: "about", label: "Sobre mí" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Proyectos" },
  { id: "education", label: "Formación" },
  { id: "contact", label: "Contacto" },
] satisfies z.input<typeof sectionsSchema>);
