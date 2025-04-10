/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Optional: Specify where your tests are located
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  // Optional: Specify folders to ignore
  // modulePathIgnorePatterns: ['<rootDir>/dist/']
}; 