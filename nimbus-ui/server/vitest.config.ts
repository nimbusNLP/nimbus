import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.d.ts', '**/*.test.ts'],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50
      }
    }
  }
});
