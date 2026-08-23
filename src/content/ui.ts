import type { z } from "zod";

import { uiSchema } from "@/lib/schemas";

export const ui = uiSchema.parse({
  theme: {
    groupLabel: "Tema",
    options: {
      system: "Auto",
      light: "Claro",
      dark: "Oscuro",
    },
  },
} satisfies z.input<typeof uiSchema>);
