import { site } from "@/content/site";
import { ui } from "@/content/ui";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-10 font-mono text-eyebrow text-muted sm:whitespace-nowrap">
        <p>
          © {site.name}
        </p>

        <p>{ui.footer.note}</p>

        <a
          className="text-trace underline underline-offset-4"
          href={ui.footer.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          {ui.footer.sourceLabel}
        </a>
      </div>
    </footer>
  );
}
