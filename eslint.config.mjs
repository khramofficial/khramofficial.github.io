import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Static export with unoptimized images: plain <img> with explicit width/height is intended.
      "@next/next/no-img-element": "off",
    },
  },
  {
    // The admin is a client-only app that loads its data from Supabase when it mounts.
    files: ["src/components/admin/**"],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  globalIgnores([".next/**", "out/**", "portable/**", "build/**", "next-env.d.ts"]),
]);
