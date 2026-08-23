import "server-only";

import {
  DARK_CLASS_NAME,
  DARK_MEDIA_QUERY,
  DEFAULT_THEME_PREFERENCE,
  RESOLVED_THEME_ATTRIBUTE,
  THEME_PREFERENCE_ATTRIBUTE,
  THEME_STORAGE_KEY,
  THEME_PREFERENCES,
} from "@/lib/theme";

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
  var allowed = ${toScriptLiteral(THEME_PREFERENCES)};
  var stored = null;
  try {
    stored = localStorage.getItem(${toScriptLiteral(THEME_STORAGE_KEY)});
  } catch (error) {
    stored = null;
  }
  var preference = allowed.indexOf(stored) === -1 ? ${toScriptLiteral(DEFAULT_THEME_PREFERENCE)} : stored;
  var prefersDark = window.matchMedia(${toScriptLiteral(DARK_MEDIA_QUERY)}).matches;
  var isDark = preference === "dark" || (preference === "system" && prefersDark);
  var root = document.documentElement;
  root.classList.toggle(${toScriptLiteral(DARK_CLASS_NAME)}, isDark);
  root.setAttribute(${toScriptLiteral(THEME_PREFERENCE_ATTRIBUTE)}, preference);
  root.setAttribute(${toScriptLiteral(RESOLVED_THEME_ATTRIBUTE)}, isDark ? "dark" : "light");
})();
`;
