// Vitest configuration
export default {
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.vitest.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,ts}'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
      all: true,
      clean: true,
      thresholds: {
        lines: 19,  // Set just below current coverage
        functions: 50,
        branches: 70,
        statements: 19  // Set just below current coverage
      }
    }
  },
  resolve: {
    alias: {
      '@': './src'
    },
    // Handle .js imports for ES modules
    extensions: ['.js', '.ts', '.json'],
    conditions: ['import', 'node']
  }
};
