module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "standard",
    "eslint:recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    "space-before-function-paren": "off",
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "no-new": "off"
  }
};
