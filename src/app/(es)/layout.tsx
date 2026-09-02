import type { Metadata } from "next";

import { SiteDocument } from "@/app/_site-document";
import { rootMetadata } from "@/lib/metadata";

export const metadata: Metadata = rootMetadata("es");

export default function SpanishRootLayout({ children }: LayoutProps<"/">) {
  return <SiteDocument locale="es">{children}</SiteDocument>;
}
