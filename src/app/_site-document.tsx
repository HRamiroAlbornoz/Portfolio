import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { getContent } from "@/content";
import { fontVariables } from "@/lib/fonts";
import { localeHref, type Locale } from "@/lib/locale";
import { DEFAULT_THEME_PREFERENCE } from "@/lib/theme";
import "./globals.css";

type SiteDocumentProps = {
  children: ReactNode;
  locale: Locale;
};

export function SiteDocument({ children, locale }: SiteDocumentProps) {
  const { site, ui } = getContent(locale);

  return (
    <html
      lang={locale}
      data-theme-preference={DEFAULT_THEME_PREFERENCE}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col bg-ink text-fore">
        <SkipLink label={ui.navigation.skipLabel} targetId="main-content" />

        <SiteHeader
          homeHref={localeHref(locale, "main-content")}
          name={site.name}
          themeLabels={ui.theme}
        />

        {children}

        <SiteFooter footer={ui.footer} name={site.name} />
      </body>
    </html>
  );
}
