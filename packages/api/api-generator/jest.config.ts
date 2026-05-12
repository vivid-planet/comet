module.exports = {
    setupFilesAfterEnv: ["./jest-setup-file.ts"],
    reporters: ["default"],
    testEnvironment: "node",
    transform: {
        "\\.ts$": "ts-jest",
    },
    testTimeout: 20000,
    testRegex: "\\.(spec|test)\\.ts$",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/__tests__/\\..*", // Exclude files starting with dot in __tests__ folder
    ],
};
