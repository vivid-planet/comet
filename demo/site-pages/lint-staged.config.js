module.exports = {
    "*.{ts,tsx,js,jsx,json,css,scss,md}": () => "pnpm lint:eslint",
    "*.{ts,tsx}": () => "pnpm lint:tsc",
};
