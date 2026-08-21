import { educationSchema } from "@/lib/schemas";

export const education = educationSchema.parse([
  {
    title: "Full Stack Web Developer",
    institution: "Henry",
    period: "Febrero 2026 — Junio 2026",
    summary:
      "Bootcamp intensivo full-time de desarrollo web: JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, testing automatizado y trabajo en equipo con metodologías ágiles.",
    highlights: [
      "Certificación Full Stack 3.0, emitida el 19 de junio de 2026",
      "Proyecto final: NEXOPAY, billetera digital multimoneda construida en equipo de 3",
    ],
  },
]);
