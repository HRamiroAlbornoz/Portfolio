export const THEME_STORAGE_KEY = "theme-preference";
export const DARK_CLASS_NAME = "dark";
export const THEME_PREFERENCE_ATTRIBUTE = "data-theme-preference";
export const RESOLVED_THEME_ATTRIBUTE = "data-theme-resolved";
export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const THEME_PREFERENCES = ["system", "light", "dark"] as const;

export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

export function isThemePreference(value: unknown): value is ThemePreference {
  return (
    typeof value === "string" &&
    (THEME_PREFERENCES as readonly string[]).includes(value)
  );
}
