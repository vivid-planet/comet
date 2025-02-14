module.exports = {
    setupFilesAfterEnv: ["./jest-setup-file.ts"],
    reporters: ["default"],
    testEnvironment: "node",
    transform: {
        "\\.[jt]sx?$": "ts-jest",
    },
    testTimeout: 10000,
};
