/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "perfectionist"],
  rules: {
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        fixStyle: "inline-type-imports",
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/require-await": "off",

    "perfectionist/sort-array-includes": [
      "warn",
      {
        groupKind: "literals-first",
        order: "asc",
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-exports": [
      "warn",
      {
        order: "asc",
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-interfaces": [
      "warn",
      {
        groups: ["unknown", "multiline"],
        order: "asc",
        partitionByNewLine: true,
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-intersection-types": [
      "warn",
      {
        order: "asc",
        type: "line-length",
      },
    ],
    "perfectionist/sort-jsx-props": [
      "warn",
      {
        groups: ["shorthand", "unknown", "multiline"],
        order: "asc",
        type: "line-length",
      },
    ],
    "perfectionist/sort-named-exports": [
      "warn",
      {
        groupKind: "mixed",
        order: "asc",
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-object-types": [
      "warn",
      {
        groups: ["unknown", "multiline"],
        order: "asc",
        partitionByNewLine: true,
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-objects": [
      "warn",
      {
        order: "asc",
        partitionByNewLine: true,
        type: "alphabetical",
      },
    ],
    "perfectionist/sort-union-types": [
      "warn",
      {
        groups: ["unknown", "nullish"],
        order: "asc",
        type: "alphabetical",
      },
    ],

    "react/jsx-key": ["error", { checkFragmentShorthand: true }],
    "react/jsx-no-useless-fragment": "warn",
  },
};
module.exports = config;
