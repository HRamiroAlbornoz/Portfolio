import type { ReactNode } from "react";

type HomeLinkProps = {
  children: ReactNode;
};

export function HomeLink({ children }: HomeLinkProps) {
  return (
    <a
      className="inline-flex min-h-11 items-center font-mono text-eyebrow uppercase text-fore"
      href="/#main-content"
    >
      {children}
    </a>
  );
}
