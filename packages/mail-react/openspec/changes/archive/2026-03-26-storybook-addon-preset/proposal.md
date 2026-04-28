## Why

The current Storybook setup uses a local `.storybook/MailRenderer.decorator.tsx` that only works inside this package. PR #5384 proposed exporting Storybook utilities via two sub-path exports (`storybook-manager` and `storybook-preview`), but that approach requires consumers to wire three things across two files — and the `initialGlobals` declaration is easy to forget, causing a runtime error in Storybook 10 when the public-URLs toggle calls `updateGlobals()` with an undeclared key.

A Storybook addon preset eliminates all manual wiring. Consumers add one line to `main.ts` and everything — the decorator, the addons, and the `initialGlobals` declaration — is auto-registered.

## What Changes

- Add a **Storybook addon preset** at `@comet/mail-react/storybook` that auto-registers the mail rendering decorator, three manager addons, and the `usePublicImageUrls` initial global
- Add three **manager-side addons**: a "Copy Mail HTML" toolbar button, a "Use public image URLs" toggle, and an "MJML Warnings" panel with badge
- Enhance the **mail renderer decorator** with public image URL replacement and a channel event (`comet-mail-render-result`) that feeds data to the manager addons
- Add `storybook` as an **optional peer dependency** (`>=10.0.0`)
- Update the **internal `.storybook/` config** to use the new library source files

## Capabilities

### New Capabilities

- `storybook-preset`: Single-export Storybook addon preset (`./storybook`) that auto-wires manager entries, preview annotations (decorator + `initialGlobals`), and exposes no public API beyond the addon name in `addons: [...]`
- `storybook-addons`: Manager-side addons — a copy-HTML toolbar button, a public-image-URLs toggle with tooltip, and an MJML warnings panel with warning count badge — communicating with the preview via a single channel event

### Modified Capabilities

- `mail-renderer-decorator`: Gains public image URL replacement (controlled by a Storybook global), emits render results via a channel event, and moves from `.storybook/MailRenderer.decorator.tsx` to library source at `src/storybook/MailRendererDecorator.tsx`

## Impact

- **New source files** in `src/storybook/` (preset, manager, preview, addon components, utility)
- **`package.json`**: one new entry in `exports` (`./storybook`), `storybook` added as optional `peerDependency`
- **Internal `.storybook/`**: `MailRenderer.decorator.tsx` removed, `manager.tsx` and `preview.tsx` updated to import from library source
- **ESLint config**: storybook source files exempted from intl/literal rules, manager files allowed to use React default import
- **No breaking changes** to existing exports (`.`, `./client`, `./server`)
