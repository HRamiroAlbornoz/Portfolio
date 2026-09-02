"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { Ui } from "@/lib/schemas";
import {
  DARK_CLASS_NAME,
  DARK_MEDIA_QUERY,
  DEFAULT_THEME_PREFERENCE,
  RESOLVED_THEME_ATTRIBUTE,
  THEME_PREFERENCE_ATTRIBUTE,
  THEME_STORAGE_KEY,
  type ThemePreference,
  isThemePreference,
  THEME_PREFERENCES,
} from "@/lib/theme";

const THEME_OPTIONS = THEME_PREFERENCES;

const THEME_ICON_PATHS: Record<ThemePreference, readonly string[]> = {
  system: [
    "M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
    "M8 21h8M12 17v4",
  ],
  light: [
    "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  ],
  dark: ["M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"],
};

function readPreferenceFromDom(): ThemePreference {
  const value = document.documentElement.getAttribute(
    THEME_PREFERENCE_ATTRIBUTE,
  );

  return isThemePreference(value) ? value : DEFAULT_THEME_PREFERENCE;
}

function readPreferenceOnServer(): ThemePreference {
  return DEFAULT_THEME_PREFERENCE;
}

function subscribeToPreference(onPreferenceChange: () => void): () => void {
  const observer = new MutationObserver(onPreferenceChange);

  observer.observe(document.documentElement, {
    attributeFilter: [THEME_PREFERENCE_ATTRIBUTE],
  });

  return () => observer.disconnect();
}

function persistPreferenceIfPossible(preference: ThemePreference): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    return;
  }
}

function applyPreference(preference: ThemePreference): void {
  const prefersDark = window.matchMedia(DARK_MEDIA_QUERY).matches;
  const isDark =
    preference === "dark" || (preference === "system" && prefersDark);
  const root = document.documentElement;

  root.classList.toggle(DARK_CLASS_NAME, isDark);
  root.setAttribute(THEME_PREFERENCE_ATTRIBUTE, preference);
  root.setAttribute(RESOLVED_THEME_ATTRIBUTE, isDark ? "dark" : "light");
}

type ThemeToggleProps = {
  labels: Ui["theme"];
};

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const preference = useSyncExternalStore(
    subscribeToPreference,
    readPreferenceFromDom,
    readPreferenceOnServer,
  );

  useEffect(() => {
    const media = window.matchMedia(DARK_MEDIA_QUERY);

    const handleSystemChange = () => {
      if (readPreferenceFromDom() === "system") {
        applyPreference("system");
      }
    };

    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  function selectPreference(next: ThemePreference): void {
    persistPreferenceIfPossible(next);
    applyPreference(next);
  }

  return (
    <fieldset className="flex items-center gap-1">
      <legend className="sr-only">{labels.groupLabel}</legend>

      {THEME_OPTIONS.map((option) => (
        <div key={option} className="contents">
          <input
            className="peer sr-only"
            type="radio"
            id={`theme-option-${option}`}
            name="theme-preference"
            value={option}
            checked={preference === option}
            onChange={() => selectPreference(option)}
          />
          <label
            className="inline-flex min-h-11 w-11 cursor-pointer items-center justify-center rounded border border-transparent px-3 font-mono text-eyebrow uppercase text-muted transition-colors hover:text-fore peer-checked:border-trace peer-checked:bg-surface peer-checked:text-trace peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-trace sm:w-auto sm:justify-start"
            htmlFor={`theme-option-${option}`}
          >
            <svg
              aria-hidden="true"
              className="size-4 shrink-0 sm:hidden"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              {THEME_ICON_PATHS[option].map((path) => (
                <path d={path} key={path} />
              ))}
            </svg>

            <span className="sr-only sm:not-sr-only">
              {labels.options[option]}
            </span>
          </label>
        </div>
      ))}
    </fieldset>
  );
}
