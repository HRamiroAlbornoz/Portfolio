import type { z } from "zod";

import { projectsSchema } from "@/lib/schemas";

export const projects = projectsSchema.parse([
  {
    slug: "nexopay",
    name: "NEXOPAY",
    role: "Backend Developer · Proyecto final de Henry · Equipo de 3",
    summary:
      "Billetera digital multimoneda en ARS, USD y EUR: compra, venta e intercambio de divisas, transferencias entre usuarios y gastos compartidos.",
    year: 2026,
    highlights: [
      "API REST de 20 endpoints con autenticación JWT",
      "Base PostgreSQL de 7 tablas con un ledger inmutable de transacciones",
      "Emails transaccionales con AWS SES y chatbot de soporte con Gemini",
    ],
    technologies: [
      "Node.js",
      "Express",
      "TypeScript",
      "PostgreSQL",
      "JWT",
      "Railway",
      "Vercel",
    ],
    repositoryUrl: "https://github.com/HRamiroAlbornoz/nexopay-api",
    liveUrl: "https://nexopay-client.vercel.app",
  },
  {
    slug: "automatehub",
    name: "AutomateHub",
    role: "Desarrollo individual · Proyecto personal",
    summary:
      "Servidor MCP que expone operaciones de la API de GitHub como herramientas para asistentes de IA.",
    year: 2026,
    highlights: [
      "13 herramientas sobre la API de GitHub con wrappers componibles",
      "Suite de 100 tests con Vitest, sin depender de la API real",
      "Jerarquía de errores propia y logging estructurado",
    ],
    technologies: ["TypeScript", "Node.js", "MCP", "Octokit", "Vitest"],
    repositoryUrl:
      "https://github.com/HRamiroAlbornoz/ProyectoM5_HernanRamiroAlbornoz",
  },
  {
    slug: "matecode",
    name: "MateCode",
    role: "Desarrollo individual · Proyecto personal",
    summary:
      "Aplicación de una sola página para gestión de tareas, con tablero kanban y reordenamiento por arrastrar y soltar.",
    year: 2026,
    highlights: [
      "Tablero kanban con arrastrar y soltar mediante dnd-kit",
      "Autenticación y persistencia de datos con Firebase",
    ],
    technologies: ["React", "TypeScript", "Firebase", "dnd-kit", "Vercel"],
    repositoryUrl:
      "https://github.com/HRamiroAlbornoz/ProyectoM4_HernanRamiroAlbornoz",
  },
] satisfies z.input<typeof projectsSchema>);
