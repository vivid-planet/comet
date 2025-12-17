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
    rootDir: "./src",

    // The test environment that will be used for testing
    testEnvironment: "jest-environment-jsdom",

    // Options that will be passed to the testEnvironment
    testEnvironmentOptions: {
        customExportConditions: ["browser", "node", "node-addons"],
    },

    // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
    testPathIgnorePatterns: ["/node_modules/"],

    moduleNameMapper: {
        "^test-utils$": "<rootDir>/testing/test-utils",
        "^react-dnd$": "<rootDir>/testing/stub-file.ts",
        "@mui/material/styles/createPalette": "<rootDir>/testing/stub-file.ts",
        "@mui/material/styles/createTypography": "<rootDir>/testing/stub-file.ts",
        "@mui/material/styles/zIndex": "<rootDir>/testing/stub-file.ts",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.test.json",
            },
        ],
    },
};
