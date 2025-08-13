module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',  
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
 parserOptions: { 
  ecmaVersion: 'latest', 
  sourceType: 'module', 
},
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
  // Existing rules...
  'react/jsx-no-target-blank': 'off',
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  
  // Adjust TypeScript rules to be less strict during development
  '@typescript-eslint/no-unused-vars': 'warn', // Changed from 'error' to 'warn'
  '@typescript-eslint/no-explicit-any': 'warn', // Keep as warning
  
  // Turn off some React rules that might be too strict
  'react/no-unescaped-entities': 'off', // Allow quotes in JSX text
  'react/jsx-no-duplicate-props': 'error', // Keep this one - it's important
  
  // Allow unused React import (common in newer React)
  'react/react-in-jsx-scope': 'off',
},
}