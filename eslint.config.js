import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';

const compat = new FlatCompat();

export default [
  js.configs.recommended,
  ...compat.extends('google', 'prettier'),
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
    },
    rules: {
      semi: ['error', 'always'],
      'no-console': 'off',
      'valid-jsdoc': 'off', // Disable deprecated rule that's causing errors
      'require-jsdoc': 'off', // Disable rule that's causing errors with flat config
    },
  },
];
