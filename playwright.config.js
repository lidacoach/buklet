// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

const fileUrl = (relativePath) =>
  'file://' + path.resolve(__dirname, relativePath);

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: fileUrl('.'),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
