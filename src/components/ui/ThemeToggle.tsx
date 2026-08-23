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
            className="inline-flex min-h-11 cursor-pointer items-center rounded px-3 font-mono text-eyebrow uppercase text-muted transition-colors hover:text-fore peer-checked:text-trace peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-trace"
            htmlFor={`theme-option-${option}`}
          >
            {labels.options[option]}
          </label>
        </div>
      ))}
    </fieldset>
  );
}
