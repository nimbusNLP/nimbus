module.exports = {
  testEnvironment: 'node',
  preset: "ts-jest",
  roots: ['./test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
