import js from '@eslint/js';
import pluginSecurity from 'eslint-plugin-security';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    plugins: {
      security: pluginSecurity,
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
    },
    files: ['**/*.js'],
    ignores: ['node_modules', 'dist', 'coverage', '.git', '.vscode'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        process: 'readonly',
      },
    },
  },
  pluginSecurity.configs.recommended,
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
];
