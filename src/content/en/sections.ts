import type { z } from "zod";

import { sectionsSchema } from "@/lib/schemas";

export const sections = sectionsSchema.parse([
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] satisfies z.input<typeof sectionsSchema>);
