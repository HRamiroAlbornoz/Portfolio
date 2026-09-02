import { themeInitScript } from "@/lib/theme-script";

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
}
