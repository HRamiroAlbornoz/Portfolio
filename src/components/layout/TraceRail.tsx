"use client";

import { useEffect, useRef, useState } from "react";

import type { Section, SectionId } from "@/lib/schemas";

const SCROLL_PROGRESS_PROPERTY = "--trace-progress";
const ARRIVAL_TOLERANCE = 4;
const BOTTOM_PROGRESS_THRESHOLD = 0.999;

type TraceRailProps = {
  label: string;
  sections: readonly Section[];
};

function readScrollProgress(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;

  if (scrollable <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function readPixels(value: string): number {
  const pixels = Number.parseFloat(value);

  return Number.isNaN(pixels) ? 0 : pixels;
}

function measureArrivalLines(
  sections: readonly Section[],
): Map<SectionId, number> {
  const scrollPadding = readPixels(
    window.getComputedStyle(document.documentElement).scrollPaddingTop,
  );
  const lines = new Map<SectionId, number>();

  for (const section of sections) {
    const element = document.getElementById(section.id);

    if (element === null) {
      continue;
    }

    const scrollMargin = readPixels(
      window.getComputedStyle(element).scrollMarginTop,
    );

    lines.set(section.id, scrollPadding + scrollMargin + ARRIVAL_TOLERANCE);
  }

  return lines;
}

function findCurrentSection(
  sections: readonly Section[],
  arrivalLines: Map<SectionId, number>,
  progress: number,
): SectionId | null {
  if (progress >= BOTTOM_PROGRESS_THRESHOLD) {
    return sections[sections.length - 1]?.id ?? null;
  }

  let current: SectionId | null = null;

  for (const section of sections) {
    const element = document.getElementById(section.id);
    const arrivalLine = arrivalLines.get(section.id);

    if (element === null || arrivalLine === undefined) {
      continue;
    }

    const box = element.getBoundingClientRect();

    if (box.height > 0 && box.top <= arrivalLine) {
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
    let isRailVisible = false;
    let arrivalLines = new Map<SectionId, number>();

    const refreshMeasurements = () => {
      isRailVisible = window.getComputedStyle(rail).display !== "none";
      arrivalLines = measureArrivalLines(sections);
    };

    const paint = () => {
      frame = 0;

      if (!isRailVisible) {
        return;
      }

      const progress = readScrollProgress();
      const active = findCurrentSection(sections, arrivalLines, progress);

      rail.style.setProperty(SCROLL_PROGRESS_PROPERTY, progress.toFixed(4));
      setActiveId(active);
    };

    const schedulePaint = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(paint);
      }
    };

    const handleResize = () => {
      refreshMeasurements();
      schedulePaint();
    };

    refreshMeasurements();
    paint();

    window.addEventListener("scroll", schedulePaint, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedulePaint);
      window.removeEventListener("resize", handleResize);
    };
  }, [sections]);

  return (
    <nav
      ref={railRef}
      aria-label={label}
      className="pointer-events-none fixed top-1/2 left-[max(1.5rem,calc(50%-33rem))] z-20 hidden -translate-y-1/2 lg:block"
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
                <span className="font-mono text-eyebrow whitespace-nowrap text-muted opacity-0 transition-opacity group-hover:text-fore group-hover:opacity-100 group-focus-visible:opacity-100 group-aria-[current=true]:text-trace group-aria-[current=true]:opacity-100 xl:opacity-100">
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
