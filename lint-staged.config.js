module.exports = {
    "packages/**/*.{ts,tsx}": "npm run lint",
    "*": () => "npx prettier -c .",
};
