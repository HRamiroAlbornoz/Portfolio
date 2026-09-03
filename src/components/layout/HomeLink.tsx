import type { ReactNode } from "react";

type HomeLinkProps = {
  children: ReactNode;
  href: string;
};

export function HomeLink({ children, href }: HomeLinkProps) {
  return (
    <a
      className="inline-flex min-h-11 items-center font-mono text-eyebrow uppercase text-fore"
      href={href}
    >
      {children}
    </a>
  );
}
