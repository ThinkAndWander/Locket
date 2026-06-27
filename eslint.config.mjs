// @ts-check

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({
  files: ['**/*.{js,ts}'],
  extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
  rules: {
    'array-callback-return': 'error', // always unintended
    'consistent-return': 'error', // avoids an easy mistake
    'no-duplicate-imports': 'error', // hard to read for repo owner
    'no-extend-native': 'error', // leads to surprising behavior
    "no-loop-func": "error", // unperformant + surprising behavior
    'no-self-compare': 'error', // always unintended, easy mistake
    "no-var": "error", // deprecated due to surprising behavior
    'no-void': 'error', // obscure, functionality no longer useful
    'consistent-type-exports': 'error', // weaker TS handling

    'default-param-last': 'warn', // somewhat harder to read
    'dot-notation': 'warn', // . syntax has intellisense and better ts/lint detection
    'no-lonely-if': 'warn', // Comes from refactoring clutter
    "no-restricted-syntax": ["warn", "ClassDeclaration"], // See readme
    'no-useless-return': 'warn', // Sliiightly makes code more verbose
    'prefer-const': 'warn', // vaguely less performant
    "prefer-object-spread": "warn", // Verbosity
    'prefer-rest-params': 'warn', // vaguely harder to read as it's uncommon
    'require-unicode-regexp': 'warn' // awareness to avoid an easy mistake
  }
});

// This file defines linting. Based on https://typescript-eslint.io/getting-started/