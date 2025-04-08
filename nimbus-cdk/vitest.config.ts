import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts', '**/*.vitest.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/cdk.out/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['lib/**/*.ts', 'bin/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.vitest.ts', '**/node_modules/**', '**/dist/**', '**/cdk.out/**'],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50
      }
    }
  }
});
