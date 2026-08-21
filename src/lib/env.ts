import { z } from "zod";

const DEVELOPMENT_SITE_URL = "http://localhost:3000";
const LOCAL_HOSTNAMES = ["localhost", "127.0.0.1", "[::1]"];

const isLocalUrl = (value: string): boolean => {
  try {
    return LOCAL_HOSTNAMES.includes(new URL(value).hostname);
  } catch {
    return false;
  }
};

const environmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .url({ protocol: /^https?$/ })
    .refine(
      (url) => url.startsWith("https://") || isLocalUrl(url),
      "Fuera de localhost la URL debe usar https",
    )
    .transform((url) => url.replace(/\/+$/, "")),
});

function readSiteUrl(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured !== undefined && configured.length > 0) {
    return configured;
  }

  return process.env.NODE_ENV === "development"
    ? DEVELOPMENT_SITE_URL
    : undefined;
}

function readEnvironment(): z.infer<typeof environmentSchema> {
  const parsed = environmentSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: readSiteUrl(),
  });

  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `${issue.path.join(".")} → ${issue.message}`)
      .join(" | ");

    throw new Error(
      `Variables de entorno inválidas: ${detail}. ` +
        "NEXT_PUBLIC_SITE_URL debe ser una URL https, o http solo en localhost. " +
        "En desarrollo se define en .env.local; en producción, en las variables de entorno del proveedor.",
    );
  }

  return parsed.data;
}

const environment = readEnvironment();

export const env = {
  siteUrl: environment.NEXT_PUBLIC_SITE_URL,
} as const;
