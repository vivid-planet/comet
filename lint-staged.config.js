module.exports = {
    "packages/**/*.{ts,tsx,js,jsx,json,css,scss,md}": "npm run lint",
    "*": () => "npx prettier -c .",
};
