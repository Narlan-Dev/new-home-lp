import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // `cinova-portal` é só uma cópia local de referência (repositório próprio), fora do escopo deste projeto
  globalIgnores(['dist', 'node_modules', 'cinova-portal']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended, prettier],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser
    },
    rules: {
      // permite `@mui/material/Button`, mas bloqueia imports profundos (`@mui/material/Button/Button`)
      'no-restricted-imports': ['error', { patterns: ['@mui/*/*/*', '!@mui/material/test-utils/*'] }],
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none' }],
      'prettier/prettier': 'warn'
    }
  }
]);
