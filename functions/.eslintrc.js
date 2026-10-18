module.exports = {
  env: {
    es6: true,
    browser: true, // for your React frontend
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
  },
  overrides: [
    // Node backend (Firebase functions)
    {
      files: ["functions/**/*.js"],
      env: {
        node: true,
        es6: true,
      },
      parserOptions: {
        ecmaVersion: 2018,
      },
      rules: {
        "no-undef": "off", // ignore undefined vars warnings
      },
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },

    // Test files
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
