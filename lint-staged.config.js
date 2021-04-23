module.exports = {
    "packages/**/*.{ts,tsx,js,jsx}": () => "npm run lint",
    "*": () => "npx prettier -c .",
};
