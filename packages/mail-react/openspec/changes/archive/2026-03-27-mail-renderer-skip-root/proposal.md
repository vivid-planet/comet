## Why

The `MailRendererDecorator` always wraps every story in `<MjmlMailRoot>`. Stories that demo `MjmlMailRoot` itself already render their own root wrapper, causing a double-wrap that breaks rendering.

## What Changes

- `.storybook/MailRenderer.decorator.tsx`: check `context.parameters.mailRoot`; skip the `<MjmlMailRoot>` wrapper when it is `false`
- `src/components/mailRoot/__stories__/MjmlMailRoot.stories.tsx`: set `parameters: { mailRoot: false }` in the Meta config

## Capabilities

### New Capabilities

- `mail-renderer-decorator-skip-root`: Opt-out parameter (`mailRoot: false`) that tells the decorator not to add its own `<MjmlMailRoot>` wrapper, for stories that already provide one

### Modified Capabilities

- `mail-renderer-decorator`: The automatic-wrapping requirement gains an opt-out condition via `parameters.mailRoot`

## Impact

- `.storybook/MailRenderer.decorator.tsx` (behavior change)
- `src/components/mailRoot/__stories__/MjmlMailRoot.stories.tsx` (parameter added)
- No public API or exported types affected; Storybook-internal only
