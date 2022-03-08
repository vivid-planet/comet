module.exports = {
    "packages/admin/**/*.{ts,tsx,js,jsx}": () => "npm run lint",
    "*": () => "npx prettier -c .",
};
