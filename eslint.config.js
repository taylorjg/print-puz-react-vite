import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import vitest from "@vitest/eslint-plugin";
import cypress from "eslint-plugin-cypress";

export default [
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    ...react.configs.flat.recommended,
    ...react.configs.flat["jsx-runtime"],
  },
  {
    files: ["**/*.{js,jsx}"],
    ...reactHooks.configs.flat.recommended,
  },
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "react-refresh/only-export-components": "warn",
    },
  },
  cypress.configs.recommended,
  {
    files: ["**/*.{test,spec}.{js,jsx}", "src/setupFiles.js"],
    ...vitest.configs.recommended,
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  {
    files: ["cypress/**/*.js"],
    rules: {
      "vitest/expect-expect": "off",
    },
  },
];
