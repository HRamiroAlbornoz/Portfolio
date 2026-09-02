export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_PATH: Record<Locale, string> = {
  es: "/",
  en: "/en",
};

export const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  es: "es_AR",
  en: "en_US",
};

export function localeHref(locale: Locale, hash?: string): string {
  return hash === undefined ? LOCALE_PATH[locale] : `${LOCALE_PATH[locale]}#${hash}`;
}
