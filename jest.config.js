module.exports = {
  setupFiles: ['<rootDir>tools/jest/setupTests.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/coverage/**'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov']
};
