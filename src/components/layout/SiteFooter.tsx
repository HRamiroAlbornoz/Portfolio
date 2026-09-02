import { LanguageLink } from "@/components/ui/LanguageLink";
import type { Site, Ui } from "@/lib/schemas";

type SiteFooterProps = {
  footer: Ui["footer"];
  language: Ui["language"];
  name: Site["name"];
};

export function SiteFooter({ footer, language, name }: SiteFooterProps) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-10 font-mono text-eyebrow text-muted sm:whitespace-nowrap">
        <p>© {name}</p>

        <p>{footer.note}</p>

        <a
          className="inline-flex min-h-11 items-center text-trace underline underline-offset-4"
          href={footer.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          {footer.sourceLabel}
        </a>

        <LanguageLink language={language} />
      </div>
    </footer>
  );
}
