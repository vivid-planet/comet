/**
 * @filename: lint-staged.config.mjs
 * @type {import('lint-staged').Configuration}
 */
export default {
    "{src,.storybook}/**/*.{ts,tsx,js,jsx,json,md}": () => "pnpm lint:eslint",
    "{src,.storybook}/**/*.{ts,tsx}": () => "pnpm lint:tsc",
    "src/**/*.css": () => ["pnpm lint:style", "pnpm lint:prettier"],
    "src/**/*.mdx": () => "pnpm lint:prettier",
    "*.{ts,mts,js,mjs,json,md,yml,yaml}": () => "pnpm lint:prettier",
};
