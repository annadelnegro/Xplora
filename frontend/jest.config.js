/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.app.json",
    },
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    // Mock CSS files
    "\\.(css|scss)$": "identity-obj-proxy",
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js', // Mock image files
  },
  setupFiles: ['./__mocks__/setupEnv.js'],
  setupFilesAfterEnv: ['./__mocks__/setupEnv.js'],
};