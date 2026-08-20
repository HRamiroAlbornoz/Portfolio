import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const THEME_SCRIPT_HOST = "src/app/layout.tsx";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    rules: {
      "react/no-danger": "error",
    },
  },
  {
    files: [THEME_SCRIPT_HOST],
    rules: {
      "react/no-danger": "off",
    },
  },
]);

export default eslintConfig;
