module.exports = {
    "*.{js,json,css,scss,md}": () => "pnpm lint:eslint",
    "*.{js,json,md,yml,yaml}": () => "pnpm lint:prettier",
};
