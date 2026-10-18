import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },

  // Frontend (React)
  {
    files: ["src/**/*.{js,jsx}"], // scope to your frontend folder
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "no-unused-vars": "warn",
      // Catches reading a variable before its declaration has run, in the same scope:
      // `const CartContext = useContext(CartContext)` crashed every page via useCart.
      // `variables: false` still allows the safe case of mentioning a later variable
      // inside a callback that only runs afterwards.
      "no-use-before-define": ["error", { functions: false, classes: true, variables: false }],
      // Flags a local variable that hides an outer one with the same name.
      "no-shadow": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  // Backend (Firebase Functions)
  {
    files: ["functions/**/*.js"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node, // ✅ Node globals (require, module, exports)
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "script", // CommonJS
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      quotes: ["error", "double", { allowTemplateLiterals: true }],
    },
  },
];
