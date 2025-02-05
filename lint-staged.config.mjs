/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
    "./!(demo|docs|packages|storybook)/**/*.{js,json,md,yml,yaml}": () => "pnpm lint:root",
};
