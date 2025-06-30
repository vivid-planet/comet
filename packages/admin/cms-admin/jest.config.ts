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

<<<<<<< HEAD
    moduleNameMapper: {
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
=======
    // The regexp pattern or array of patterns that Jest uses to detect test files
    // testRegex: [],

    // This option allows the use of a custom results processor
    // testResultsProcessor: undefined,

    // This option allows use of a custom test runner
    // testRunner: "jasmine2",

    // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
    // testURL: "http://localhost",

    // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
    // timers: "real",

    // A map from regular expressions to paths to transformers
    // transform: undefined,

    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    // transformIgnorePatterns: [
    //   "/node_modules/",
    //   "\\.pnp\\.[^\\/]+$"
    // ],

    // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
    // unmockedModulePathPatterns: undefined,

    // Indicates whether each individual test should be reported during the run
    // verbose: undefined,

    // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
    // watchPathIgnorePatterns: [],

    // Whether to use watchman for file crawling
    // watchman: true,

    moduleNameMapper: {
        "^react-dnd$": "<rootDir>/testing/stub-file.ts",
>>>>>>> main
    },
};
