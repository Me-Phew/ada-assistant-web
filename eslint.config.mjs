// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
// @ts-ignore
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
// @ts-ignore
import securityPlugin from "eslint-plugin-security";

export default withNuxt([
  prettierConfig,
  {
    plugins: {
      prettierPlugin,
      securityPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      semi: ["error", "always"],
      "vue/no-empty-component-block": 1,
    },
  },
]);
