import { z } from "zod";

export const THEME_STORAGE_KEY = "theme-preference";
export const DARK_CLASS_NAME = "dark";
export const THEME_PREFERENCE_ATTRIBUTE = "data-theme-preference";
export const RESOLVED_THEME_ATTRIBUTE = "data-theme-resolved";

export const themePreferenceSchema = z.enum(["system", "light", "dark"]);

export type ThemePreference = z.infer<typeof themePreferenceSchema>;

export const DEFAULT_THEME_PREFERENCE: ThemePreference = "system";

declare const scriptLiteralBrand: unique symbol;

type ScriptLiteral = string & { readonly [scriptLiteralBrand]: true };

function toScriptLiteral(value: unknown): ScriptLiteral {
  return JSON.stringify(value).replace(/</g, "\\u003c") as ScriptLiteral;
}

function inlineScript(
  strings: TemplateStringsArray,
  ...values: readonly ScriptLiteral[]
): string {
  return strings.reduce(
    (result, chunk, index) => result + chunk + (values[index] ?? ""),
    "",
  );
}

export const themeInitScript = inlineScript`
(function () {
  var allowed = ${toScriptLiteral(themePreferenceSchema.options)};
  var stored = null;
  try {
    stored = localStorage.getItem(${toScriptLiteral(THEME_STORAGE_KEY)});
  } catch (error) {
    stored = null;
  }
  var preference = allowed.indexOf(stored) === -1 ? ${toScriptLiteral(DEFAULT_THEME_PREFERENCE)} : stored;
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var isDark = preference === "dark" || (preference === "system" && prefersDark);
  var root = document.documentElement;
  root.classList.toggle(${toScriptLiteral(DARK_CLASS_NAME)}, isDark);
  root.setAttribute(${toScriptLiteral(THEME_PREFERENCE_ATTRIBUTE)}, preference);
  root.setAttribute(${toScriptLiteral(RESOLVED_THEME_ATTRIBUTE)}, isDark ? "dark" : "light");
})();
`;
