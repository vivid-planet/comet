/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
    "**/*.js": () => "pnpm lint:oxlint",
    "**/*.{js,mjs,json,md,yml,yaml}": () => "pnpm lint:oxfmt",
};
