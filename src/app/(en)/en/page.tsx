import type { Metadata } from "next";

import { SiteHome } from "@/components/layout/SiteHome";
import { homeMetadata } from "@/lib/metadata";

export const metadata: Metadata = homeMetadata("en");

export default function EnglishHomePage() {
  return <SiteHome locale="en" />;
}
