import { FlatCompat } from "@eslint/eslintrc"; // For compatibility with legacy configs
import { dirname } from "path"; // To get directory name from file path
import { fileURLToPath } from "url"; // Converts import.meta.url to file path

const __filename = fileURLToPath(import.meta.url); // Get current file path
const __dirname = dirname(__filename); // Get current directory path

const compat = new FlatCompat({ baseDirectory: __dirname }); // Create compat instance with base dir

export default [
  ...compat.extends(
    // Extend base ESLint configs/plugins
    "next/core-web-vitals", // Next.js core web vitals rules
    "next/typescript", // Next.js + TypeScript rules
    "plugin:react-hooks/recommended", // React hooks recommended rules
    "plugin:@typescript-eslint/recommended", // Recommended TypeScript rules
    "plugin:import/errors", // Import plugin error rules
    "plugin:import/warnings", // Import plugin warning rules
    "plugin:import/typescript", // Import plugin TypeScript support
  ),
  {
    rules: {
      eqeqeq: ["error", "always"], // Enforce === and !== over == and !=
      "no-console": "error", // Error on console usage
      "no-unused-vars": "off", // Disable base unused vars rule
      "@typescript-eslint/no-unused-vars": [
        // Enable TS version with args/vars ignore pattern
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"], // Disallow mixed spaces and tabs (allow smart-tabs)

      "react/jsx-filename-extension": [
        // Restrict JSX to .tsx files only
        "error",
        { extensions: [".tsx"] },
      ],
      "react/function-component-definition": [
        // Enforce arrow functions for components
        "error",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "arrow-function",
        },
      ],
      "react-hooks/exhaustive-deps": "error", // Ensure effect dependencies are complete
      "react/no-unused-prop-types": "error", // Disallow unused React prop types

      "@typescript-eslint/no-explicit-any": "off", // Allow usage of 'any' type

      "import/newline-after-import": "error", // Enforce newline after import statements
      "import/no-unresolved": "error", // Error on unresolved imports
      "import/order": [
        // Enforce consistent import order
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "arrow-body-style": "error", // Enforce consistent arrow function bodies
      "object-shorthand": "error", // Enforce shorthand syntax for objects
      "prefer-arrow-callback": "error", // Prefer arrow functions for callbacks
      "prefer-destructuring": "error", // Prefer destructuring from objects/arrays
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest", // Use latest ECMAScript version
        sourceType: "module", // Use ES modules
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
      },
    },
  },
];
