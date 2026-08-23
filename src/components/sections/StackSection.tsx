import { PageSection } from "@/components/ui/PageSection";
import { TechnologyIcon } from "@/components/ui/TechnologyIcon";
import { stack } from "@/content/stack";

type StackSectionProps = {
  title: string;
};

export function StackSection({ title }: StackSectionProps) {
  return (
    <PageSection id="stack" title={title}>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute top-[5px] bottom-[5px] left-[5px] w-px bg-trace"
        />

        <ol className="flex flex-col gap-8">
          {stack.map((layer) => (
            <li key={layer.id}>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="size-[11px] shrink-0 rounded-full bg-trace"
                />
                <span
                  aria-hidden="true"
                  className="h-px w-4 shrink-0 bg-trace"
                />
                <h3 className="font-mono text-eyebrow uppercase text-trace">
                  {layer.label}
                </h3>
              </div>

              <ul className="mt-3 ml-[3.4375rem] flex flex-wrap gap-x-5 gap-y-2 text-body text-muted">
                {layer.items.map((item) => (
                  <li className="flex items-center gap-2" key={item.name}>
                    <TechnologyIcon name={item.icon} />
                    {item.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex items-center gap-4">
          <span
            aria-hidden="true"
            className="size-[11px] shrink-0 rounded-full bg-trace"
          />
        </div>
      </div>
    </PageSection>
  );
}
