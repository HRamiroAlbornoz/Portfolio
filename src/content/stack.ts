import { stackSchema } from "@/lib/schemas";

export const stack = stackSchema.parse([
  {
    id: "interface",
    label: "Interfaz",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    id: "logic",
    label: "Lógica",
    items: ["Node.js", "Express", "APIs REST", "JWT", "Zod", "MCP"],
  },
  {
    id: "data",
    label: "Datos",
    items: ["PostgreSQL", "SQL", "Firebase (Firestore)"],
  },
  {
    id: "tooling",
    label: "Calidad y herramientas",
    items: [
      "Vitest",
      "Supertest",
      "Swagger",
      "Git",
      "Git Flow",
      "GitHub",
      "Railway",
      "Vercel",
    ],
  },
]);
