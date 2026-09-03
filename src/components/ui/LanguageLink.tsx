import Link from "next/link";

import { localeHref } from "@/lib/locale";
import type { Ui } from "@/lib/schemas";

type LanguageLinkProps = {
  language: Ui["language"];
};

export function LanguageLink({ language }: LanguageLinkProps) {
  return (
    <Link
      className="inline-flex min-h-11 w-11 shrink-0 items-center justify-center rounded border border-transparent font-mono text-eyebrow uppercase text-muted transition-colors hover:border-line hover:text-fore focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace"
      href={localeHref(language.code)}
      hrefLang={language.code}
    >
      <span aria-hidden="true">{language.label}</span>
      <span className="sr-only">{language.description}</span>
    </Link>
  );
}
