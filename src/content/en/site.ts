import type { z } from "zod";

import { siteSchema } from "@/lib/schemas";

export const site = siteSchema.parse({
  name: "Hernán Ramiro Albornoz",
  role: "Full Stack Developer",
  tagline:
    "I build web applications end to end: React and Next.js on the interface, Node.js and PostgreSQL on the API. Tested and in production.",
  location: "San Miguel de Tucumán, Argentina",
  availability: "Available remotely or in Tucumán",
  languages: "Native Spanish · English B1 (EFSET)",
  email: "hralborn@hotmail.com",
  contactNote: "I reply within one business day.",
  bio: [
    "Full Stack Developer trained at Henry, with React, Next.js and TypeScript on the interface and Node.js, Express and PostgreSQL on the server. I built complete REST APIs —JWT authentication, automated tests and production deploys— working in a team with Git Flow, code review and sprints.",
    "Full Stack Developer building modern web applications with an AI-powered spec-driven development (SDD) approach. Focused on clean, scalable and maintainable code.",
  ],
  socialLinks: [
    { label: "GitHub", url: "https://github.com/HRamiroAlbornoz" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/hernan-ramiro-albornoz/",
    },
  ],
  resumes: [
    { label: "Spanish", language: "es", path: "/cv/hernan-albornoz-cv.pdf" },
    { label: "English", language: "en", path: "/cv/hernan-albornoz-cv-en.pdf" },
  ],
} satisfies z.input<typeof siteSchema>);
