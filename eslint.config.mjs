import js from "@eslint/js"
import globals from "globals"
import json from "@eslint/json"
import markdown from "@eslint/markdown"
import css from "@eslint/css"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      semi: ["error", "never"] // Nunca usar ponto e vírgula
    }
  },

  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm", extends: ["markdown/recommended"] },
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },

  {
    files: ["**/*.{js,mjs,cjs,css,md,json}"],
    rules: {
      "no-trailing-spaces": "error", // Nada de espaços em branco no final da linha
      "eol-last": ["error", "always"], // Os arquivos precisam ter a última linha em branco
    }
  },

  globalIgnores(["./coverage", "package*.json"])
])
