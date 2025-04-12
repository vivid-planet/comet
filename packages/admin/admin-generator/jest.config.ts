import type { Config } from 'jest';

const config: Config = {
    reporters: ["default"],
    testEnvironment: "node",
    transform: {
        "\\.tsx?$": ["ts-jest", {
            isolatedModules: true // disables type-cecking during test run, needed for parseConfig tests
        }],
    },
    testTimeout: 20000,
    testPathIgnorePatterns: ["/node_modules/", "/__tests__/\\.(temp|test).*", "/lib/"],
};

export default config;

