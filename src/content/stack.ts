import type { z } from "zod";

import { stackSchema } from "@/lib/schemas";

export const stack = stackSchema.parse([
  {
    id: "interface",
    label: "Interfaz",
    items: [
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
    ],
  },
  {
    id: "logic",
    label: "Lógica",
    items: [
      { name: "Node.js", icon: "nodedotjs" },
      { name: "Express", icon: "express" },
      { name: "APIs REST" },
      { name: "JWT", icon: "jsonwebtokens" },
      { name: "Zod", icon: "zod" },
      { name: "MCP", icon: "modelcontextprotocol" },
    ],
  },
  {
    id: "data",
    label: "Datos",
    items: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "SQL" },
      { name: "Firebase (Firestore)", icon: "firebase" },
    ],
  },
  {
    id: "tooling",
    label: "Calidad y herramientas",
    items: [
      { name: "Vitest", icon: "vitest" },
      { name: "Supertest" },
      { name: "Swagger", icon: "swagger" },
      { name: "Git", icon: "git" },
      { name: "Git Flow" },
      { name: "GitHub", icon: "github" },
      { name: "Railway", icon: "railway" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
] satisfies z.input<typeof stackSchema>);
