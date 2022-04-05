module.exports = {
    "packages/admin/**/*.{ts,tsx,js,jsx,json,css,scss,md}": () => "npx yarn lint:eslint",
    "packages/admin/**/*.{ts,tsx}": () => "npx yarn lint:tsc",
    "*": () => "npx yarn exec prettier -c .",
};
