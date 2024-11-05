module.exports = {
    "./!(demo|docs|packages|storybook)/**/*.{js,json,md,yml,yaml}": () => "pnpm lint:root",
};
