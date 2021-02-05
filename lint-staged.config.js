module.exports = {
    "packages/**/*.{ts,tsx,js,jsx,json,css,scss,md}": "yarn run lint",
    "*": () => "npx prettier -c .",
};
