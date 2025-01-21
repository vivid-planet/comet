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

    // A map from regular expressions to paths to transformers
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
    // transformIgnorePatterns: ["<rootDir>/node_modules/(?!(@mui)/)"],
    //transformIgnorePatterns: ["<rootDir>/node_modules/(?!@react-dnd|react-dnd|core-dnd|@react-dnd|dnd-core|react-dnd-html5-backend)"],
    transformIgnorePatterns: ["node_modules/(?!(react-dnd|dnd-core|react-dnd-html5-backend)/)"],

    moduleNameMapper: {
        "^react-dnd$": "<rootDir>/testing/stub-file.ts",
        // "^react-dnd$": "react-dnd/dist/cjs",
        // "^react-dnd-html5-backend$": "react-dnd-html5-backend/dist/cjs",
        // "^dnd-core$": "dnd-core/dist/cjs",
    },
};
