module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    indent: ["error", 2],
    "object-curly-spacing": ["error", "always"],
    "quote-props": ["error", "as-needed"],
    "max-len": "off",
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
};
