import { PageSection } from "@/components/ui/PageSection";
import { TechnologyIcon } from "@/components/ui/TechnologyIcon";
import type { Stack } from "@/lib/schemas";

type StackSectionProps = {
  stack: Stack;
  title: string;
};

export function StackSection({ stack, title }: StackSectionProps) {
  return (
    <PageSection id="stack" title={title}>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute top-[5px] bottom-[5px] left-[5px] w-px bg-trace"
        />

        <ol className="flex flex-col gap-8">
          {stack.map((layer) => (
            <li className="flex items-start gap-4" key={layer.id}>
              <span
                aria-hidden="true"
                className="mt-px size-[11px] shrink-0 rounded-full bg-trace"
              />
              <span
                aria-hidden="true"
                className="mt-[6px] h-px w-4 shrink-0 bg-trace"
              />

              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-eyebrow uppercase text-trace">
                  {layer.label}
                </h3>

                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-body text-muted">
                  {layer.items.map((item) => (
                    <li className="flex items-center gap-2" key={item.name}>
                      <TechnologyIcon name={item.icon} />
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <span
          aria-hidden="true"
          className="mt-6 block size-[11px] rounded-full bg-trace"
        />
      </div>
    </PageSection>
  );
}
