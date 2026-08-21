import { z } from "zod";

const DEVELOPMENT_SITE_URL = "http://localhost:3000";

const environmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .url({ protocol: /^https?$/ })
    .transform((url) => url.replace(/\/+$/, "")),
});

function readEnvironment(): z.infer<typeof environmentSchema> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "development" ? DEVELOPMENT_SITE_URL : undefined);

  const parsed = environmentSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: siteUrl,
  });

  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".")} → ${issue.message}`)
      .join(" | ");

    throw new Error(
      `Variables de entorno inválidas: ${detail}. ` +
        "NEXT_PUBLIC_SITE_URL debe ser una URL http o https. " +
        "En desarrollo se define en .env.local; en producción, en las variables de entorno del proveedor.",
    );
  }

  return parsed.data;
}

const environment = readEnvironment();

export const env = {
  siteUrl: environment.NEXT_PUBLIC_SITE_URL,
} as const;
