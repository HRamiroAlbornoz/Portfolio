import type { Metadata } from "next";
import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google";

import { DEFAULT_THEME_PREFERENCE, themeInitScript } from "@/lib/theme";
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
  title: "Hernán Ramiro Albornoz — Desarrollador Full Stack",
  description:
    "Portfolio de Hernán Ramiro Albornoz, desarrollador Full Stack egresado de Henry.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-theme-preference={DEFAULT_THEME_PREFERENCE}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-ink text-fore">
        {children}
      </body>
    </html>
  );
}
