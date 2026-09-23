import type { z } from "zod";

import { siteSchema } from "@/lib/schemas";

export const site = siteSchema.parse({
  name: "Hernán Ramiro Albornoz",
  role: "Desarrollador Full Stack",
  tagline:
    "Construyo aplicaciones web de punta a punta: React y Next.js en la interfaz, Node.js y PostgreSQL en la API. Testeadas y en producción.",
  location: "San Miguel de Tucumán, Argentina",
  availability: "Disponible en remoto o en Tucumán",
  languages: "Español nativo · Inglés B1 (EFSET)",
  email: "hralborn@hotmail.com",
  contactNote: "Respondo en menos de 24 horas hábiles.",
  bio: [
    "Desarrollador Full Stack egresado de Henry: React, Next.js y TypeScript en la interfaz; Node.js, Express y PostgreSQL en el servidor. Construí APIs REST completas —autenticación con JWT, tests automatizados y deploy en producción— trabajando en equipo con Git Flow, code review y sprints.",
    "Full Stack Developer construyendo aplicaciones web modernas con un enfoque de desarrollo guiado por especificaciones (SDD) potenciado por IA. Enfocado en código limpio, escalable y mantenible.",
  ],
  socialLinks: [
    { label: "GitHub", url: "https://github.com/HRamiroAlbornoz" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/hernan-ramiro-albornoz/",
    },
  ],
  resumes: [
    { label: "Español", language: "es", path: "/cv/hernan-albornoz-cv.pdf" },
    { label: "English", language: "en", path: "/cv/hernan-albornoz-cv-en.pdf" },
  ],
} satisfies z.input<typeof siteSchema>);
