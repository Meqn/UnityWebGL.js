/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // roots: ['<rootDir>'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '@lib/(.*)': '<rootDir>/packages/lib/$1'
  },
  setupFiles: ['jest-canvas-mock'],
  collectCoverage: true // 是否显示覆盖率报告
}
