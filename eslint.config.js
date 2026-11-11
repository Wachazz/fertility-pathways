// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'android/*', 'ios/*', '.expo/*'],
  },
  {
    // Build scripts run in Node, not in the app.
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: { __dirname: 'readonly', require: 'readonly', process: 'readonly', console: 'readonly' },
    },
  },
]);
