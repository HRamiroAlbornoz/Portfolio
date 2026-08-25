import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { site } from "@/content/site";
import { ui } from "@/content/ui";

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase();
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-[var(--header-height)] w-full max-w-3xl items-center justify-between px-6">
        <a
          className="inline-flex min-h-11 items-center font-mono text-eyebrow uppercase text-fore"
          href="/#main-content"
        >
          {getInitials(site.name)}
        </a>

        <ThemeToggle labels={ui.theme} />
      </div>
    </header>
  );
}
