import { defineConfig } from 'vitest/config';

// Only run heavy/dist-dependent tests in CI
const isCI = !!process.env.CI;

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    // Exclude CI-only tests locally. GitHub Actions sets CI=true, so these will run in CI.
    exclude: isCI ? [] : ['tests/*.ci.test.js'],
    environment: 'node',
  },
});
