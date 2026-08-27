import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#14120f";
const LINE = "#3a3630";
const MUTED = "#a39c92";
const FORE = "#f2efea";
const TRACE = "#9fc27c";

const NODE_SIZE = 14;
const RAIL_WIDTH = 2;

const fontsDirectory = join(process.cwd(), "assets", "fonts");

const [archivoBold, instrumentSansRegular, jetBrainsMonoRegular] =
  await Promise.all([
    readFile(join(fontsDirectory, "Archivo-Bold.woff")),
    readFile(join(fontsDirectory, "InstrumentSans-Regular.woff")),
    readFile(join(fontsDirectory, "JetBrainsMono-Regular.woff")),
  ]);

function TraceNode() {
  return (
    <div
      style={{
        display: "flex",
        width: NODE_SIZE,
        height: NODE_SIZE,
        borderRadius: NODE_SIZE / 2,
        backgroundColor: TRACE,
      }}
    />
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "68px 88px",
          backgroundColor: INK,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: NODE_SIZE,
            marginRight: 40,
          }}
        >
          <TraceNode />
          <div
            style={{
              display: "flex",
              flexGrow: 1,
              width: RAIL_WIDTH,
              backgroundColor: TRACE,
            }}
          />
          <TraceNode />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontSize: 25,
              letterSpacing: "0.18em",
              color: TRACE,
            }}
          >
            {site.role.toUpperCase()}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
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

            <div
              style={{
                display: "flex",
                marginTop: 30,
                maxWidth: 880,
                fontFamily: "Instrument Sans",
                fontSize: 30,
                lineHeight: 1.5,
                color: MUTED,
              }}
            >
              {site.tagline}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              letterSpacing: "0.08em",
              color: MUTED,
            }}
          >
            <div style={{ display: "flex" }}>
              {site.availability.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                width: 28,
                height: 1,
                margin: "0 20px",
                backgroundColor: LINE,
              }}
            />
            <div style={{ display: "flex" }}>{site.location.toUpperCase()}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
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
