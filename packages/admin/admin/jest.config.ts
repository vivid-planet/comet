module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["/node_modules/", "/lib/"],
    setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};
