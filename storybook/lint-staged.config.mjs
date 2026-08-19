/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
    "{src,.storybook}/**/*.{ts,tsx,js,jsx}": () => "pnpm lint:oxlint",
    "src/**/*.{ts,tsx}": () => "pnpm lint:tsc",
    "**/*.{ts,tsx,js,jsx,mjs,cjs,mts,json,css,scss,md,mdx,yml,yaml}": () => "pnpm lint:oxfmt",
};
