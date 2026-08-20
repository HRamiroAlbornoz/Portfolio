import { z } from "zod";

export const THEME_STORAGE_KEY = "theme-preference";
export const DARK_CLASS_NAME = "dark";
export const RESOLVED_THEME_ATTRIBUTE = "data-theme-resolved";

export const themePreferenceSchema = z.enum(["system", "light", "dark"]);

export type ThemePreference = z.infer<typeof themePreferenceSchema>;

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

const allowedPreferences = JSON.stringify(themePreferenceSchema.options);

export const themeInitScript = `
(function () {
  var allowed = ${allowedPreferences};
  var stored = null;
  try {
    stored = localStorage.getItem("${THEME_STORAGE_KEY}");
  } catch (error) {
    stored = null;
  }
  var preference = allowed.indexOf(stored) === -1 ? "${DEFAULT_THEME_PREFERENCE}" : stored;
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var isDark = preference === "dark" || (preference === "system" && prefersDark);
  var root = document.documentElement;
  root.classList.toggle("${DARK_CLASS_NAME}", isDark);
  root.dataset.themePreference = preference;
  root.dataset.themeResolved = isDark ? "dark" : "light";
})();
`;
