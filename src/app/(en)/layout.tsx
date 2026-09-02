import type { Metadata } from "next";

import { SiteDocument } from "@/app/_site-document";
import { rootMetadata } from "@/lib/metadata";

export const metadata: Metadata = rootMetadata("en");

export default function EnglishRootLayout({ children }: LayoutProps<"/">) {
  return <SiteDocument locale="en">{children}</SiteDocument>;
}
