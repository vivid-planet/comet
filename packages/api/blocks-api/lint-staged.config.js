module.exports = {
    "*.{ts,tsx,js,jsx,json,css,scss,md}": () => "npx yarn lint:eslint",
    "*.{ts,tsx}": () => "npx yarn lint:tsc",
};
