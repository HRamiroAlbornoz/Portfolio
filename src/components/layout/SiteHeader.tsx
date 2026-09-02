import { HomeLink } from "@/components/layout/HomeLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { site } from "@/content/site";
import { ui } from "@/content/ui";

function splitName(fullName: string): { first: string; last: string } {
  const [first = fullName, ...rest] = fullName.split(" ");

  return { first, last: rest.at(-1) ?? "" };
}

export function SiteHeader() {
  const { first, last } = splitName(site.name);

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-[var(--header-height)] w-full max-w-3xl items-center justify-between px-6">
        <HomeLink>
          {first}
          {last !== "" && <span className="hidden sm:inline">&nbsp;{last}</span>}
        </HomeLink>

        <ThemeToggle labels={ui.theme} />
      </div>
    </header>
  );
}
