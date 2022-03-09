module.exports = {
    "packages/admin/**/*.{ts,tsx,js,jsx}": () => "npx yarn lint",
    "*": () => "npx prettier -c .",
};
