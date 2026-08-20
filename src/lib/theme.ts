import { z } from "zod";

export const THEME_STORAGE_KEY = "theme-preference";
export const DARK_CLASS_NAME = "dark";

export const themePreferenceSchema = z.enum(["system", "light", "dark"]);

export type ThemePreference = z.infer<typeof themePreferenceSchema>;

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

const allowedPreferences = JSON.stringify(themePreferenceSchema.options);

export const themeInitScript = `
(function () {
  try {
    var allowed = ${allowedPreferences};
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var preference = allowed.indexOf(stored) === -1 ? "${DEFAULT_THEME_PREFERENCE}" : stored;
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = preference === "dark" || (preference === "system" && prefersDark);
    var root = document.documentElement;
    root.classList.toggle("${DARK_CLASS_NAME}", isDark);
    root.dataset.themePreference = preference;
  } catch (error) {
    document.documentElement.dataset.themePreference = "${DEFAULT_THEME_PREFERENCE}";
  }
})();
`;
