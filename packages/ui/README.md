# @dextinity/ui

Themeable React UI primitives for Dextinity applications — the admin, the site and prototypes — built on [Base UI](https://base-ui.com) and CSS Modules.

The package is **experimental**: any export may change or be removed without a deprecation notice, and every export carries the `@experimental` TSDoc tag.

Its documentation is its Storybook: the components, the design tokens, the theming guide and the usage patterns. In a clone of the dextinity repository, run `pnpm install` and `pnpm --filter @dextinity/ui run storybook`, then open http://localhost:26648. The Storybook includes an [MCP server](#storybook-mcp-server), so coding agents can read the same documentation.

## Usage

```sh
pnpm add @dextinity/ui @base-ui/react
```

`@base-ui/react` is a peer dependency, so an application's own Base UI controls, for example inside a `FormField`, share the components' copy.

```tsx
// Once, at the root of the application
import "@dextinity/ui/css";
import "@dextinity/ui/themes/dextinity.css";
```

```html
<html data-dextinity-theme="dextinity" data-dextinity-color-scheme="light"></html>
```

```tsx
import { Button } from "@dextinity/ui";

<Button onClick={save}>Save changes</Button>;
```

The theme names its fonts, but doesn't load them: the Dextinity theme uses [Figtree](https://fonts.google.com/specimen/Figtree), for example through `@fontsource-variable/figtree`. See "Foundations/Theming" in the Storybook for switching the color scheme and creating a theme.

## Principles

- **The code is the single source of truth.** Components, tokens and themes are defined here and documented in the Storybook. Designers change the design through pull requests to this package; Figma follows the code, not the other way around.
- **UI only.** No routing, forms state, data fetching or translations. All text comes in through props, so the package works in the admin and the site alike.
- **No dependency on the admin's styling stack.** No MUI, Emotion or `@dextinity/admin*` imports; ESLint enforces this.
- **Accessible by default.** Components require an accessible name where they can't derive one, every theme meets WCAG 2.2 AA contrast (a unit test checks it), and every story runs an accessibility check.
- **Server-renderable.** Component modules that need the browser start with `"use client"`, which the build keeps, so they work in Next.js server components.

## Decisions

- **Base UI as the foundation.** Base UI provides behavior and accessibility without styles, so the styling is fully ours. Wrap its parts; don't reimplement what it provides. Its documentation ships with the package: `node_modules/@base-ui/react/docs/react/components/<name>.md`.
- **CSS Modules with native CSS nesting.** Styles are plain CSS, compiled by Vite. The build lowers nesting for older browsers.
- **CSS custom properties as the theme.** There is no JavaScript theme object. A theme is a stylesheet that defines the [design tokens](src/docs/DesignTokens.mdx), applied through the `data-dextinity-theme` attribute. Apply it to `<html>`, so popups rendered outside the application root follow it too.
- **Everything in `@layer dextinity`.** An application's own, unlayered CSS always wins, whatever its specificity.
- **Stable class names.** Each component emits fixed class names, so applications can style it with plain CSS. See [Styling contract](#styling-contract).

## Folder and file names

- One feature folder per component, camelCase: `button/`, `iconButton/`, `radioGroup/`.
- `<Component>.tsx` (PascalCase) for a component, `<featureName>.ts` (camelCase) for anything else.
- `<Component>.module.css` for a component's styles. The file name determines the emitted class names, so it must match the component.
- `<Component>.test.tsx` next to the component; stories in `__stories__/<Component>.stories.tsx`.
- `src/themes/` holds the themes, `src/docs/` the Storybook pages that aren't tied to a component, `src/storybook/` helpers that only the stories use. Stories import those helpers as `#storybook/<file>`.

## Component conventions

Read [`src/button/Button.tsx`](src/button/Button.tsx) as the reference implementation.

### Exports

Each component exports:

- the component, a function named after it;
- its props as an interface, `<Component>Props`;
- its owner state as a type, `<Component>OwnerState`;
- the props of its inner parts as an interface, `<Component>SlotProps`, if it has inner parts;
- the union types of its enum props, such as `ButtonVariant`.

`src/index.ts` re-exports all of them. The package has named exports only.

### Props

- A component extends the props of the element that matters most to its user: the button for `Button`, the checkbox control for `Checkbox`. It passes the props it doesn't handle to that element, so every attribute and event handler of the element works without a dedicated prop.
- Enum props have a default; the default is documented with `@defaultValue`.
- Boolean props are optional and have no default; they are off when absent. A boolean that is the controlled value, like `checked`, follows Base UI.
- Props that take text, like `label`, are `ReactNode` and never have a default text: the package contains no user-facing text.
- `children` is typed with `PropsWithChildren`, unless the component can't work without it — a heading's text, an icon button's icon, a form field's control. Then it's a required, documented prop. A list of items, such as a radio group's options, stays optional: it may be empty while the items load.
- When a component can't get an accessible name from its content, it requires one through a prop, like `IconButton`'s `label`.

### Override API

The [styling contract](#styling-contract) is the main way to adjust a component. These props do what it can't:

- **`className`** and **`style`** — applied to the component's outermost element. `className` is added to the component's own classes, never replacing them.
- **`slotProps`** — props for the component's inner parts, as an object or as a function of the owner state. They are merged with the part's own props by `resolveSlotProps`: classes are added, `style` is merged, event handlers run before the part's own, other props replace the part's own, including `ref`. `render` in a slot's props replaces the part's element, for example `{ label: { render: <strong /> } }`. Name every slot and every owner state field in the `slotProps` TSDoc: generated documentation doesn't expand the types.
- **Owner state** — the resolved configuration that changes how the component looks or behaves: `variant`, `size`, `disabled`, … It doesn't hold interaction state, such as hover or focus, which CSS handles. Its keys are single lowercase words, because they become `data-*` attributes. `disabled` reflects the component's own `disabled` prop; when an enclosing Base UI `Fieldset` or `Field.Root` disables a component, Base UI's `data-disabled` on its parts shows it instead.

There is no `slots` prop to swap a part's component, and no theme-level default props: wrap a component in the application to change its defaults.

### Styling contract

Every component emits class names and `data-*` attributes for consumers to style with plain CSS. They are public API: renaming one is a breaking change.

- **Root class** `dextinity<Component>` on the outermost element, for example `dextinityButton`.
- **Part classes** `dextinity<Component>__<part>` on inner parts, for example `dextinityButton__startIcon`. A part that consumers can customize has a `slotProps` key of the same name.
- **Owner state** as attributes on the root: `data-variant="primary"` for an enum, `data-disabled` (present or absent) for a boolean.
- A component that renders another one as its root carries both root classes: `IconButton` renders `dextinityButton dextinityIconButton`.
- Base UI's own attributes, such as `data-checked` or `data-invalid`, are part of the contract too.

In the stylesheet, the local class `root` becomes the root class and any other class a part class (see [`generateScopedName`](src/cssModules/generateScopedName.ts)).

### Stylesheets

- Wrap everything in `@layer dextinity { … }`.
- Use design tokens for every value a theme might want to change, and nothing but [documented tokens](src/docs/DesignTokens.mdx); the theme contract test fails on any other `--dextinity-*` property. If a token is missing, add it in the same change: document it and define it in every theme.
- Name private custom properties `--_<name>`, for example `--_background`, and set variant-specific values through them rather than repeating declarations.
- Style owner state with attribute selectors nested under `.root` (`&[data-variant="primary"]`). Put a blank line before every nested rule.
- Show focus with `:focus-visible` and the focus ring tokens. Put hover styles inside `@media (hover: hover)`, so they don't stick on touch screens.
- A component sets its own font family and size instead of inheriting them, so it looks the same inside a page that uses another font, such as an MUI admin.
- No `!important`, no global selectors, no element selectors outside the component's own parts.

### TSDoc

The TSDoc on the exports is the component's documentation: Storybook's docs page, the MCP server and the editor all show it.

- The component's comment starts with what it is for, then says when to use it and how to use it well. It ends with `@summary`, a one-line description for listings, and `@experimental`.
- Every prop has a description that says what it does and, where helpful, when to use which value. Its default goes into `@defaultValue`.
- Say what a feature does, not how it is implemented, and keep it short.

### Stories

- `__stories__/<Component>.stories.tsx` in [CSF 3](https://storybook.js.org/docs/api/csf), with `title: "Components/<Component>"` and the meta typed with `satisfies Meta<typeof Component>`.
- Don't put a comment on `meta`: it would replace the component's TSDoc in the documentation.
- `meta.args` holds what every story needs, such as `children` and event handlers created with `fn()`.
- The first story is `Default`, the smallest practical example. Order the rest by usefulness: agents get full code for the first three stories only. Give each story a comment that says why to use it, with a `@summary`.
- Use literal args. Story-only helpers come from `#storybook/<file>`, so the documentation doesn't present them as exports of the package.
- Write JSX children in `render`, not in `args`, and put layout around several components into a story decorator: code snippets leave decorators out, and they print multi-line JSX from `args` incorrectly.
- Every declared prop has a control: `radio` for up to three options, `select` for more, a `select` with `mapping` for `ReactNode` props. Override props (`className`, `slotProps`, `render`) get `control: false`.
- Behavior — clicks, keyboard, focus, disabled — is tested in a story's `play` function.
- Development-only stories go into `__stories__/<name>.dev.stories.tsx` with the tags `["!autodocs", "!manifest"]`.

## Testing

Test what a consumer depends on, not the implementation:

- **Utilities** — a unit test next to the utility.
- **A component's styling contract** — its classes and `data-*` attributes, and how slot props are merged — a unit test next to the component. Don't assert styles.
- **Behavior** — a `play` function in a story, which runs in a real browser. Every story also runs an accessibility check and fails on violations.
- **Themes** — [`themeContract.test.ts`](src/themes/themeContract.test.ts) checks every theme against the documented tokens and the contrast requirements.

Rendering alone isn't worth a test: every story already renders in a browser test.

## Storybook MCP server

While the Storybook runs, it serves an [MCP server](https://storybook.js.org/docs/ai/mcp/overview) at http://localhost:26648/mcp. It lets coding agents list the components, read their documentation and stories, read the documentation pages (design tokens, theming, patterns), and run the story tests. The documentation pages are plain Markdown, so agents read the same text as people.

Without a running Storybook, `pnpm --filter @dextinity/ui exec storybook tools docs list` and `… docs show --id <id>` print the same documentation. Both need a clone of the dextinity repository: the published package contains only the built components.

## Build

`vite build` compiles the components to ES modules in `lib/`, one module per source file, keeping `"use client"`. All component styles go into `lib/style.css` (`@dextinity/ui/css`). The themes listed in `vite.config.mts` are copied to `lib/themes/`; the Acme theme is a Storybook-only example and isn't published. The type declarations target `moduleResolution: "bundler"`, as used by Vite and Next.js.
