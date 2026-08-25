type HomeLinkProps = {
  label: string;
};

export function HomeLink({ label }: HomeLinkProps) {
  return (
    <a
      className="inline-flex min-h-11 items-center font-mono text-eyebrow uppercase text-fore"
      href="/#main-content"
    >
      {label}
    </a>
  );
}
