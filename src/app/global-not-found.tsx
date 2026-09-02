import type { Metadata } from "next";
import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { ui } from "@/content/ui";
import { DEFAULT_THEME_PREFERENCE } from "@/lib/theme";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const fontVariables = [
  archivo.variable,
  instrumentSans.variable,
  jetBrainsMono.variable,
].join(" ");

export const metadata: Metadata = {
  title: ui.notFound.title,
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="es"
      data-theme-preference={DEFAULT_THEME_PREFERENCE}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-ink text-fore">
        <SkipLink label={ui.navigation.skipLabel} targetId="main-content" />
        <SiteHeader />

        <main
          className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-6 px-6 py-24 focus-visible:outline-none"
          id="main-content"
          tabIndex={-1}
        >
          <p className="font-mono text-eyebrow uppercase text-pending">
            {ui.notFound.code}
          </p>

          <h1 className="font-display text-title text-fore">
            {ui.notFound.title}
          </h1>

          <p className="max-w-prose text-body text-muted">
            {ui.notFound.description}
          </p>

          <Link
            className="inline-flex min-h-11 items-center self-start font-mono text-eyebrow uppercase text-trace underline underline-offset-4"
            href="/"
          >
            {ui.notFound.homeLabel}
          </Link>
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
