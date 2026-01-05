/** @type {import('jest').Config} */
export default {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/.svelte-kit/',
  ],
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!@grimoire)',
  ],
  moduleNameMapper: {
    '^@grimoire/yetzirah-core$': '<rootDir>/packages/core/src/index.js',
  },
  collectCoverageFrom: [
    'packages/*/src/**/*.js',
    '!packages/*/src/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
}
