module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '@grimoire/yetzirah-core': '<rootDir>/../core/dist/index.js',
    '^@angular/core/testing$': '<rootDir>/node_modules/@angular/core/fesm2022/testing.mjs'
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|@angular|@yetzirah)'
  ],
  moduleFileExtensions: ['ts', 'js', 'html', 'mjs'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/public-api.ts'
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  }
}
