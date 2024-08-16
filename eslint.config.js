import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import solid from "eslint-plugin-solid";
import ally from "eslint-plugin-jsx-a11y";
import tailwindcss from "eslint-plugin-tailwindcss";
// import * as tan from "@tanstack/eslint-plugin-query";

export default [
  {
    languageOptions: { globals: globals.browser },
  },
  {
    ignores: [
      ".output/**",
      ".vinxi/**",
      "node_modules/**",
      "**/*.cjs",
      "public/**",
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { rules: solid.configs.recommended.rules, plugins: { solid } },
  { rules: solid.configs.typescript.rules, plugins: { solid } },
  { rules: ally.configs.recommended.rules, plugins: { "jsx-a11y": ally } },
  { rules: tailwindcss.configs.recommended.rules, plugins: { tailwindcss } },
  // { rules: tan.configs.recommended.rules, plugins: { "@tanstack/query": tan } },
];
