const globals = require('globals');
const eslintJs = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    // This block should *only* have the "ignores" property.
    // https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
    ignores: ['node_modules/**', '.tap/**'],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        fetch: false, // not present in node globals (readonly)
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // to parse nextjs files
        },
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': ['error'],
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'no-param-reassign': 'error',
      'no-shadow': 'error',
      'no-console': 'error',
      'max-classes-per-file': 'error',
      complexity: 'error',
      'no-empty': 'error',
      curly: 'error',
      'max-len': ['error', { code: 132, comments: 162 }],
      'max-lines': ['error', 1000],
      quotes: ['error', 'single'],
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }],
    },
  },
];
