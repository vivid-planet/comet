module.exports = {
    "*.{ts,tsx,js,jsx,json,css,scss,md}": () => "pnpm lint:eslint",
    "*.{js,json,md,yml,yaml}": () => "pnpm lint:prettier",
    "docs/**": "cspell",
};
