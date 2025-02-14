module.exports = {
    setupFilesAfterEnv: ["./jest-setup-file.ts"],
    reporters: ["default"],
    testEnvironment: "node",
    transform: {
        "\\.ts$": "ts-jest",
    },
    testTimeout: 20000,
};
