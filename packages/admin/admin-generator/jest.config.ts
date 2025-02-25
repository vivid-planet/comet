module.exports = {
    reporters: ["default"],
    testEnvironment: "node",
    transform: {
        "\\.ts$": "ts-jest",
    },
    testTimeout: 20000,
};
