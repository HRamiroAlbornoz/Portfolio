import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google";

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

export const fontVariables = [
  archivo.variable,
  instrumentSans.variable,
  jetBrainsMono.variable,
].join(" ");
