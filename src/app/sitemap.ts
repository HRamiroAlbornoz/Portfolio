import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { LOCALES, LOCALE_PATH } from "@/lib/locale";

function absoluteUrl(path: string): string {
  return path === "/" ? env.siteUrl : `${env.siteUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: absoluteUrl(LOCALE_PATH[locale]),
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((alternate) => [
          alternate,
          absoluteUrl(LOCALE_PATH[alternate]),
        ]),
      ),
    },
  }));
}
