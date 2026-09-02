import type { z } from "zod";

import { uiSchema } from "@/lib/schemas";

export const ui = uiSchema.parse({
  navigation: {
    railLabel: "Secciones del sitio",
    skipLabel: "Saltar al contenido",
  },
  language: {
    code: "en",
    label: "EN",
    description: "Ver este sitio en inglés",
  },
  notFound: {
    code: "Error 404",
    title: "Esta página no existe",
    description:
      "El enlace que seguiste apunta a una dirección que no está en este sitio. Puede que se haya escrito mal, o que el contenido ya no esté acá.",
    homeLabel: "Volver al inicio",
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
