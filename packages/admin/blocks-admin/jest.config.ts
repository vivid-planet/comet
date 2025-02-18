/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",

    // A preset that is used as a base for Jest's configuration
    preset: "ts-jest",

    // Use this configuration option to add custom reporters to Jest
    reporters: ["default", "jest-junit"],

    // The root directory that Jest should scan for tests and modules within
    rootDir: "./",

    // The test environment that will be used for testing
    testEnvironment: "jest-environment-jsdom",

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/"],

    moduleNameMapper: {
        "^react-dnd$": "<rootDir>/testing/stub-file.ts",
    },
};
