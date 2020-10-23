module.exports = {
  preset: 'ts-jest',
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: [
    "/node_modules/", "/lib/"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/setupTests.ts"
  ],
};