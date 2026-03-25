## Why

Ship Storybook utilities tailored for mail development — a rendering decorator, copy-HTML button, MJML warning inspection, and public image URL substitution — so consumers can set up a full mail Storybook with low effort.

## What Changes

- Add a **manager entry point** (`@comet/mail-react/storybook-manager`) exporting `registerMailStorybookAddons()` which registers three Storybook addons: a copy-HTML toolbar button, a public-image-URLs toggle, and an MJML warnings panel with badge
- Add a **preview entry point** (`@comet/mail-react/storybook-preview`) exporting a pre-built `MailRendererDecorator` handling the full MJML render pipeline and addon communication
- Add two new sub-path exports to `package.json` (`./storybook-manager` and `./storybook-preview`)
- Refactor the internal `.storybook/` configuration to use the new library exports instead of its own bespoke implementation

## Capabilities

### New Capabilities

- `storybook-addons`: Manager-side Storybook addons — a copy-HTML toolbar button, a public-image-URLs toggle with tooltip, and an MJML warnings panel with warning count badge — plus a `registerMailStorybookAddons()` function to wire them all up
- `storybook-preview-decorator`: Preview-side `MailRendererDecorator` that wraps stories in `MjmlMailRoot`, renders to HTML via `renderMailHtml`, applies public-URL image replacement when toggled, emits render results to addons via a single channel event, and displays the rendered HTML

### Modified Capabilities

_None — the internal `.storybook/` refactoring is handled as implementation tasks, not spec-level changes._

## Impact

- **New source files** in `src/storybook-manager/` and `src/storybook-preview/`
- **`package.json`**: two new entries in `exports`, `storybook` added as optional `peerDependency`
- **Internal `.storybook/`**: simplified to consume from the new library exports
- **No breaking changes** to existing exports (`.`, `./client`, `./server`)
