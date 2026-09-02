import type { z } from "zod";

import { uiSchema } from "@/lib/schemas";

export const ui = uiSchema.parse({
  navigation: {
    railLabel: "Site sections",
    skipLabel: "Skip to content",
  },
  language: {
    code: "es",
    label: "ES",
    description: "View this site in Spanish",
  },
  notFound: {
    code: "Error 404",
    title: "This page does not exist",
    description:
      "The link you followed points to an address that is not on this site. It may have been mistyped, or the content may no longer be here.",
    homeLabel: "Back to home",
  },
  footer: {
    note: "Next.js · TypeScript · Tailwind CSS",
    sourceLabel: "Source code of this site",
    sourceUrl: "https://github.com/HRamiroAlbornoz/Portfolio",
  },
  projects: {
    empty: "Not deployed yet",
    live: "View live",
    repository: "Code",
  },
  theme: {
    groupLabel: "Theme",
    options: {
      system: "Auto",
      light: "Light",
      dark: "Dark",
    },
  },
} satisfies z.input<typeof uiSchema>);
