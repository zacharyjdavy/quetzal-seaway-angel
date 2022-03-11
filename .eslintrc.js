module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // THIS MUST BE LAST IN THIS ARRAY. Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  rules: {
    'camelcase': 'off',

    /* Best practice rules */
    "no-implicit-coercion": "error",
    "default-case": "error",
    "eqeqeq": ["error", "smart"],
    "max-classes-per-file": ["error", 1],
    "no-eval": "error",
    "no-fallthrough": "error",
    "no-implied-eval": "error",
    "no-lone-blocks": "error",
    "no-new": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-self-compare": "error",
    "no-self-assign": "error",
    "no-sequences": "error",
    "no-throw-literal": "error",
    "no-useless-catch": "error",
    "prefer-regex-literals": "error",
    "require-await": "error",
    "no-console": "error",
    "vars-on-top": "error",

    /* Style rules */
    "one-var": ["error", "never"],

    /* ES6 specific rules */
    "object-shorthand": ["error", "always"],
    "no-var": "error",
    "prefer-const": "error",

    /* Typescript specific rules */
    '@typescript-eslint/ban-types': 'off',
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/camelcase": ["error", { "properties": "never" }],
    '@typescript-eslint/no-unused-vars': 'off', // TSCompiler built-in
    '@typescript-eslint/no-untyped-public-signature': 'error',
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/member-naming': ['error'],
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    "@typescript-eslint/explicit-function-return-type": 'off',
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

    /* FW Web App conventions */
    "@typescript-eslint/no-empty-function": ["error", { "allow": ["constructors"] }],

    /* Allowing ts-ignore */
    // We allow ts-ignore for these use cases:  
    // 1. to access and test private members in our test suite
    // 2. to disable snake_case checks, to speed up class definitions
    // 3. to disable checks in CS->TS migrated code
    "@typescript-eslint/ban-ts-ignore": "off",

    // This is needed for helping the TS migration. Once we are done with it, we will be able to
    // work on remove our usage of any, when making sense
    "@typescript-eslint/no-explicit-any": "off",

    // We want this turn on, but it will be incompatible with our usage of fieldwireData.currentProject
    "@typescript-eslint/no-non-null-assertion": "off",
  },
  overrides: [
    {
      files: ['*.spec.ts', '*_spec.ts'],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
      }
    },
    {
      files: ['typings/**/*'],
      rules: {
        "@typescript-eslint/camelcase": "off"
      }
    }
  ]
};
