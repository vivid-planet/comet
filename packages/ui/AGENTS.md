# Agent Instructions — @dextinity/ui

Read [README.md](README.md) before working in this package. It defines the package's principles, decisions and conventions, which differ from the rest of the repository: this package styles with CSS Modules, not Emotion or MUI, so neighboring packages and the repository's styling guideline are not a reliable guide here. Where they disagree, the README wins. When a change shifts a convention or reverses a decision, update the README in the same change.

## Using the components

Before using or changing a component, read its documentation instead of guessing props:

- With the Storybook running, use the `dextinity-ui-storybook` MCP server: `docs-list`, then `docs-show` for a component or page, `docs-show-story` for a story's code. Use only documented props.
- Without it: `pnpm --filter @dextinity/ui exec storybook tools docs list` and `pnpm --filter @dextinity/ui exec storybook tools docs show --id <id>`.
- A story's code starts with imports from its story file. In application code, keep the `@dextinity/ui` and `@base-ui/react` imports, add React's own imports, such as `useState`, where the code uses them, and drop the rest: `fn()` from `storybook/test` stands for a real event handler, `#storybook/icons` for the application's icons, `*.stories.module.css` for its own styles.

The pages under "Foundations" (theming, design tokens, customization) and "Patterns" explain how the components work together.

## Running processes (dev-pm)

| Name                     | What it does                                     |
| ------------------------ | ------------------------------------------------ |
| `ui`                     | `vite build --watch` — rebuilds `lib/` on change |
| `storybook-dextinity-ui` | `storybook dev -p 26648`, with the MCP server    |

Storybook runs at http://localhost:26648, the MCP server at http://localhost:26648/mcp.

## Checks

Run these from `packages/ui/` after a change:

| Script     | Result                                                                   |
| ---------- | ------------------------------------------------------------------------ |
| `lint:fix` | Fixes ESLint, Prettier and Stylelint issues                              |
| `lint`     | Reports remaining lint, formatting, style and TypeScript errors          |
| `test`     | Runs the unit tests and the story tests (in a browser, with a11y checks) |

Changing a token means changing [src/docs/DesignTokens.mdx](src/docs/DesignTokens.mdx) and every theme in `src/themes/` together; the theme contract test checks that they agree.
