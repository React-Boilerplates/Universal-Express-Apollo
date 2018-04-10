module.exports = {
  setupFiles: ['<rootDir>tools/jest/setupTests.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/coverage/**',
    '!**/public/**',
    '!**/build/**',
    '!**/static/**',
    '!**/tools/**',
    '!**/jest.*.js',
    '!**/dev.*.js',
    '!**/dev.js',
    '!**/mocks.*.js',
    '!**/mocks.js'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov']
};
