// @ts-check

import eslint from "@eslint/js";
import ts from "typescript-eslint";
import mocha from "eslint-plugin-mocha";
import configPrettier from "eslint-config-prettier";
import n from "eslint-plugin-n";
import security from "eslint-plugin-security";

export default ts.config(
  eslint.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  n.configs["flat/recommended-module"],
  security.configs.recommended,
  configPrettier,
  {
    ignores: ["*.d.ts"],
  },
  {
    files: ["*.ts"],
    languageOptions: {
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  },
  {
    files: ["*.ts", "eslint.config.mjs"],
    rules: {
      indent: ["error", 2],
      quotes: ["error", "double"],
      "linebreak-style": ["error", "unix"],
      semi: ["error", "always"],
      eqeqeq: ["error", "always"],
      "no-constant-condition": ["error", { checkLoops: false }],
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "n/no-missing-import": "off", // This rule causes false positives on type-only packages
    },
  },
  {
    files: ["eslint.config.mjs"],
    languageOptions: {
      parserOptions: {
        project: "tsconfig.eslint.json",
      },
    },
  },
  mocha.configs.flat.recommended,
  {
    files: ["test.ts"],
    rules: {
      "mocha/no-exclusive-tests": "error",
      "mocha/no-pending-tests": "error",
      "mocha/no-skipped-tests": "error",
      "mocha/no-top-level-hooks": "error",
    },
  }
);
