import type { Metadata } from "next";

import { SiteHome } from "@/components/layout/SiteHome";
import { homeMetadata } from "@/lib/metadata";

export const metadata: Metadata = homeMetadata("es");

export default function HomePage() {
  return <SiteHome locale="es" />;
}
