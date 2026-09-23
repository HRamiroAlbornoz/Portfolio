import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import type { ReactNode } from "react";

import type { Site } from "@/lib/schemas";

export const PREVIEW_SIZE = { width: 1200, height: 630 };
export const PREVIEW_CONTENT_TYPE = "image/png";

const INK = "#14120f";
const MUTED = "#a39c92";
const FORE = "#f2efea";
const TRACE = "#9fc27c";

const NODE_SIZE = 14;
const NODE_BORDER = 2;
const RAIL_WIDTH = 2;
const RAIL_GAP = 40;
const TICK_WIDTH = 24;
const STEP_GAP = 28;
const PADDING_TOP = 68;
const PADDING_LEFT = 88;
const NAME_NODE_OFFSET = 36;

const fontsDirectory = join(process.cwd(), "assets", "fonts");

const [archivoBold, instrumentSansRegular, jetBrainsMonoRegular] =
  await Promise.all([
    readFile(join(fontsDirectory, "Archivo-Bold.woff")),
    readFile(join(fontsDirectory, "InstrumentSans-Regular.woff")),
    readFile(join(fontsDirectory, "JetBrainsMono-Regular.woff")),
  ]);

type TraceStepProps = {
  children: ReactNode;
  nodeOffset: number;
};

function TraceStep({ children, nodeOffset }: TraceStepProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <div
        style={{
          display: "flex",
          position: "relative",
          flexShrink: 0,
          width: NODE_SIZE,
          height: NODE_SIZE,
          marginTop: nodeOffset,
          borderRadius: NODE_SIZE / 2,
          border: `${NODE_BORDER}px solid ${TRACE}`,
          backgroundColor: INK,
        }}
      />
      <div
        style={{
          display: "flex",
          flexShrink: 0,
          width: TICK_WIDTH,
          height: RAIL_WIDTH,
          marginTop: nodeOffset + (NODE_SIZE - RAIL_WIDTH) / 2,
          marginRight: RAIL_GAP - TICK_WIDTH,
          backgroundColor: TRACE,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

export function renderPreviewImage(site: Site): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: `${PADDING_TOP}px ${PADDING_LEFT}px 0`,
          backgroundColor: INK,
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: PADDING_TOP + NAME_NODE_OFFSET + NODE_SIZE / 2,
            bottom: 0,
            left: PADDING_LEFT + (NODE_SIZE - RAIL_WIDTH) / 2,
            width: RAIL_WIDTH,
            backgroundColor: TRACE,
          }}
        />

        <div
          style={{ display: "flex", flexDirection: "column", gap: STEP_GAP }}
        >
          <TraceStep nodeOffset={NAME_NODE_OFFSET}>
            <div
              style={{
                display: "flex",
                fontFamily: "Archivo",
                fontSize: 86,
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: FORE,
              }}
            >
              {site.name}
            </div>
          </TraceStep>

          <TraceStep nodeOffset={12}>
            <div
              style={{
                display: "flex",
                fontFamily: "Archivo",
                fontSize: 40,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: MUTED,
              }}
            >
              {site.role}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 12,
                maxWidth: 880,
                fontFamily: "Instrument Sans",
                fontSize: 30,
                lineHeight: 1.5,
                color: FORE,
              }}
            >
              {site.tagline}
            </div>
          </TraceStep>

          <TraceStep nodeOffset={4}>
            <div
              style={{
                display: "flex",
                fontFamily: "JetBrains Mono",
                fontSize: 26,
                letterSpacing: "0.08em",
                color: FORE,
              }}
            >
              {site.availability.toUpperCase()}
            </div>
          </TraceStep>

          <TraceStep nodeOffset={4}>
            <div
              style={{
                display: "flex",
                fontFamily: "JetBrains Mono",
                fontSize: 26,
                letterSpacing: "0.08em",
                color: MUTED,
              }}
            >
              {site.location.toUpperCase()}
            </div>
          </TraceStep>
        </div>
      </div>
    ),
    {
      ...PREVIEW_SIZE,
      fonts: [
        {
          name: "Archivo",
          data: archivoBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Instrument Sans",
          data: instrumentSansRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "JetBrains Mono",
          data: jetBrainsMonoRegular,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
