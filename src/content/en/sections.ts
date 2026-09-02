import type { z } from "zod";

import { sectionsSchema } from "@/lib/schemas";

export const sections = sectionsSchema.parse([
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] satisfies z.input<typeof sectionsSchema>);
