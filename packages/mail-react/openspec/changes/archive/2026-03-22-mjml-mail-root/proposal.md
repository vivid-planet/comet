## Why

Consumers currently need to manually assemble `<Mjml>`, `<MjmlHead>`, `<MjmlAttributes>`, and `<MjmlBody>` for every email template. A single `MjmlMailRoot` component provides the standard email skeleton with sensible defaults (zero padding via `<MjmlAll padding={0} />`), reducing boilerplate and ensuring consistency across templates. The Storybook decorator also benefits — it can use this component instead of manually wiring up `<Mjml>` and `<MjmlBody>`.

## What Changes

- **New `MjmlMailRoot` component** — wraps `<Mjml>`, `<MjmlHead>`, `<MjmlAttributes>`, and `<MjmlBody>` into a single component. The head includes `<MjmlAll padding={0} />` as the only default attribute. Accepts only children for now. Exported from the package entry point with TSDoc comments.
- **Storybook decorator updated** — the `MailRendererDecorator` uses `MjmlMailRoot` instead of manually assembling `<Mjml><MjmlBody>`.
- **Storybook story** — a story for `MjmlMailRoot` validates rendering and provides autodocs.

## Capabilities

### New Capabilities
- `mjml-mail-root`: The root email component that provides the standard `<Mjml>` + `<MjmlHead>` + `<MjmlBody>` skeleton with `<MjmlAll padding={0} />` as the default attribute.

### Modified Capabilities
- `mail-renderer-decorator`: The decorator switches from manually wrapping with `<Mjml><MjmlBody>` to using the new `MjmlMailRoot` component.

## Impact

- **New file**: `src/components/mailRoot/MjmlMailRoot.tsx`
- **New file**: `src/components/mailRoot/__stories__/MjmlMailRoot.stories.tsx`
- **Modified file**: `src/index.ts` — adds `MjmlMailRoot` export
- **Modified file**: `.storybook/MailRenderer.decorator.tsx` — uses `MjmlMailRoot`
- **No breaking changes** — existing `Mjml`, `MjmlBody`, `MjmlHead` re-exports remain available
