import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/rules-of-hooks": "off", // Completely disables the rule
      // Or you can use 'warn' instead of 'off' to get warnings but not errors:
      // "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;
