/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
    "./!(demo|docs|packages|storybook)/**/*": () => "pnpm lint:root",
};
