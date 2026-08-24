type SkipLinkProps = {
  label: string;
  targetId: string;
};

export function SkipLink({ label, targetId }: SkipLinkProps) {
  return (
    <a
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:inline-flex focus-visible:min-h-11 focus-visible:items-center focus-visible:rounded focus-visible:border focus-visible:border-trace focus-visible:bg-surface focus-visible:px-4 focus-visible:text-body focus-visible:text-fore focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trace"
      href={`#${targetId}`}
    >
      {label}
    </a>
  );
}
