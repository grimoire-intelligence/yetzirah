/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js'],
  transform: {},
  collectCoverageFrom: [
    'packages/*/src/**/*.js',
    '!packages/*/src/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
}
