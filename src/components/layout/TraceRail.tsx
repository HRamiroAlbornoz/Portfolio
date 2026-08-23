"use client";

import { useEffect, useRef, useState } from "react";

import type { Section, SectionId } from "@/lib/schemas";

const SCROLL_PROGRESS_PROPERTY = "--trace-progress";
const READING_LINE_RATIO = 0.5;
const BOTTOM_PROGRESS_THRESHOLD = 0.999;

type TraceRailProps = {
  label: string;
  sections: readonly Section[];
};

function readScrollProgress(): number {
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;

  if (scrollable <= 0) {
    return 1;
  }

  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function findSectionAtReadingLine(
  sections: readonly Section[],
): SectionId | null {
  if (readScrollProgress() >= BOTTOM_PROGRESS_THRESHOLD) {
    return sections[sections.length - 1]?.id ?? null;
  }

  const readingLine = window.innerHeight * READING_LINE_RATIO;
  let current: SectionId | null = null;

  for (const section of sections) {
    const element = document.getElementById(section.id);

    if (element !== null && element.getBoundingClientRect().top <= readingLine) {
      current = section.id;
    }
  }

  return current;
}

export function TraceRail({ label, sections }: TraceRailProps) {
  const railRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  useEffect(() => {
    const rail = railRef.current;

    if (rail === null) {
      return;
    }

    let frame = 0;

    const paint = () => {
      frame = 0;
      rail.style.setProperty(
        SCROLL_PROGRESS_PROPERTY,
        readScrollProgress().toFixed(4),
      );
      setActiveId(findSectionAtReadingLine(sections));
    };

    const schedule = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(paint);
      }
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);

  return (
    <nav
      ref={railRef}
      aria-label={label}
      className="pointer-events-none fixed top-1/2 left-6 z-20 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute top-0 left-[5px] h-full w-px bg-line"
        />
        <span
          aria-hidden="true"
          className="absolute top-0 left-[5px] h-full w-px origin-top bg-trace [transform:scaleY(var(--trace-progress,0))]"
        />

        <ul className="relative flex flex-col">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                aria-current={activeId === section.id ? "true" : undefined}
                className="group pointer-events-auto flex min-h-11 items-center gap-3 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-trace"
                href={`#${section.id}`}
              >
                <span
                  aria-hidden="true"
                  className="size-[11px] shrink-0 rounded-full border border-line bg-ink transition-colors group-hover:border-trace group-aria-[current=true]:border-trace group-aria-[current=true]:bg-trace"
                />
                <span className="font-mono text-eyebrow whitespace-nowrap text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-aria-[current=true]:text-trace group-aria-[current=true]:opacity-100">
                  {section.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
