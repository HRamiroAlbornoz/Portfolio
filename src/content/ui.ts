import type { z } from "zod";

import { uiSchema } from "@/lib/schemas";

export const ui = uiSchema.parse({
  navigation: {
    railLabel: "Secciones del sitio",
  },
  footer: {
    note: "Next.js · TypeScript · Tailwind CSS",
    sourceLabel: "Código de este sitio",
    sourceUrl: "https://github.com/HRamiroAlbornoz/Portfolio",
  },
  projects: {
    empty: "Todavía sin desplegar",
    live: "Ver en vivo",
    repository: "Código",
  },
  theme: {
    groupLabel: "Tema",
    options: {
      system: "Auto",
      light: "Claro",
      dark: "Oscuro",
    },
  },
} satisfies z.input<typeof uiSchema>);
