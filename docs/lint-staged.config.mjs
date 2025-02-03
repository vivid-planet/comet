/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
    "*.{ts,tsx,js,jsx,json,css,scss,md}": () => "pnpm lint:eslint",
    "*.{js,json,md,yml,yaml}": () => "pnpm lint:prettier",
};
