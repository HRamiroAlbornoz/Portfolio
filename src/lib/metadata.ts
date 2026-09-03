import type { Metadata } from "next";

import { getContent } from "@/content";
import { env } from "@/lib/env";
import { LOCALE_PATH, OPEN_GRAPH_LOCALE, type Locale } from "@/lib/locale";

export function rootMetadata(locale: Locale): Metadata {
  const { site } = getContent(locale);
  const title = `${site.name} — ${site.role}`;

  return {
    metadataBase: new URL(env.siteUrl),
    title: {
      default: title,
      template: `%s — ${site.name}`,
    },
    description: site.tagline,
    openGraph: {
      type: "website",
      locale: OPEN_GRAPH_LOCALE[locale],
      url: LOCALE_PATH[locale],
      siteName: site.name,
      title,
      description: site.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: site.tagline,
    },
  };
}

export function homeMetadata(locale: Locale): Metadata {
  return {
    alternates: {
      canonical: LOCALE_PATH[locale],
      languages: LOCALE_PATH,
    },
  };
}
