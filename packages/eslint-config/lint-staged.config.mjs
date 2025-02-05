/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
    "*.{js,json,css,scss,md}": () => "pnpm lint:eslint",
    "*.{js,json,md,yml,yaml}": () => "pnpm lint:prettier",
};
