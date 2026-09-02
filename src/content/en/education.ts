import type { z } from "zod";

import { educationSchema } from "@/lib/schemas";

export const education = educationSchema.parse([
  {
    title: "Full Stack Web Developer",
    institution: "Henry",
    period: "February 2026 — June 2026",
    summary:
      "Intensive full-time web development bootcamp: JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, automated testing and teamwork with agile methodologies.",
    highlights: [
      "Full Stack 3.0 certification, issued on 19 June 2026",
      "Final project: NEXOPAY, a multi-currency digital wallet built in a team of 3",
    ],
  },
] satisfies z.input<typeof educationSchema>);
