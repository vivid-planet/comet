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

    // The test environment that will be used for testing
    testEnvironment: "jest-environment-jsdom",

    // Options that will be passed to the testEnvironment
    testEnvironmentOptions: {
        customExportConditions: ["browser", "node", "node-addons"],
    },

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/"],

    moduleNameMapper: {
        "^react-dnd$": "<rootDir>/src/testing/stub-file.ts",
        "@mui/material/styles/createPalette": "<rootDir>/src/testing/stub-file.ts",
        "@mui/material/styles/createTypography": "<rootDir>/src/testing/stub-file.ts",
        "@mui/material/styles/zIndex": "<rootDir>/src/testing/stub-file.ts",
    },
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.test.json",
            },
        ],
    },
};
