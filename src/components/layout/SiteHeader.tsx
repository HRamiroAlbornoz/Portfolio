import { HomeLink } from "@/components/layout/HomeLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Site, Ui } from "@/lib/schemas";

function splitName(fullName: string): { first: string; last: string } {
  const [first = fullName, ...rest] = fullName.split(" ");

  return { first, last: rest.at(-1) ?? "" };
}

type SiteHeaderProps = {
  homeHref: string;
  name: Site["name"];
  themeLabels: Ui["theme"];
};

export function SiteHeader({ homeHref, name, themeLabels }: SiteHeaderProps) {
  const { first, last } = splitName(name);

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex h-[var(--header-height)] w-full max-w-3xl items-center justify-between px-6">
        <HomeLink href={homeHref}>
          {first}
          {last !== "" && <span className="hidden sm:inline">&nbsp;{last}</span>}
        </HomeLink>

        <ThemeToggle labels={themeLabels} />
      </div>
    </header>
  );
}
