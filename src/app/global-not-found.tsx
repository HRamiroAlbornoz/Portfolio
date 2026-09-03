import type { Metadata } from "next";
import Link from "next/link";

import { SiteDocument } from "@/app/_site-document";
import { getContent } from "@/content";
import { DEFAULT_LOCALE, localeHref } from "@/lib/locale";
import { rootMetadata } from "@/lib/metadata";

const { site, ui } = getContent(DEFAULT_LOCALE);

export const metadata: Metadata = {
  ...rootMetadata(DEFAULT_LOCALE),
  title: `${ui.notFound.title} — ${site.name}`,
};

export default function GlobalNotFound() {
  return (
    <SiteDocument locale={DEFAULT_LOCALE}>
      <main
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-24 focus-visible:outline-none"
        id="main-content"
        tabIndex={-1}
      >
        <p className="font-mono text-eyebrow uppercase text-pending">
          {ui.notFound.code}
        </p>

        <h1 className="font-display text-title text-fore">
          {ui.notFound.title}
        </h1>

        <p className="max-w-prose text-body text-muted">
          {ui.notFound.description}
        </p>

        <Link
          className="inline-flex min-h-11 items-center self-start font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
          href={localeHref(DEFAULT_LOCALE)}
        >
          {ui.notFound.homeLabel}
        </Link>
      </main>
    </SiteDocument>
  );
}
