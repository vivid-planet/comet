## 1. Preview Decorator

- [ ] 1.1 Create `src/storybook-preview/replaceImagesWithPublicUrl.ts` — utility function that replaces `<img>` src attributes with `https://picsum.photos/seed/{seed}/{width*2}/{height*2}` based on each image's width/height attributes
- [ ] 1.2 Create `src/storybook-preview/MailRendererDecorator.tsx` — Storybook decorator that wraps stories in `<MjmlMailRoot>`, renders via `renderMailHtml` (client), applies public URL replacement when the global is active, emits a single `comet-mail-render-result` channel event with `{ html, mjmlWarnings }`, and renders the HTML via `dangerouslySetInnerHTML`
- [ ] 1.3 Create `src/storybook-preview/index.ts` — barrel export for `MailRendererDecorator`

## 2. Manager Addons

- [ ] 2.1 Create `src/storybook-manager/CopyMailHtmlButton.tsx` — toolbar button that subscribes to `comet-mail-render-result` and copies the HTML to clipboard, showing "Copied to clipboard!" for 2 seconds
- [ ] 2.2 Create `src/storybook-manager/UsePublicImageUrlsToggle.tsx` — toolbar toggle button with checkbox, tooltip, and ℹ️ emoji that controls the `usePublicImageUrls` Storybook global
- [ ] 2.3 Create `src/storybook-manager/MjmlWarningsPanel.tsx` — addon panel that subscribes to `comet-mail-render-result` and displays MJML warnings with tag name, line number, and message; panel title includes a compact badge with warning count or "✓"
- [ ] 2.4 Create `src/storybook-manager/index.ts` — exports `registerMailStorybookAddons()` which calls `addons.register(...)` and registers all three addons (copy HTML as tool, public URLs as tool, MJML warnings as panel)

## 3. Package Configuration

- [ ] 3.1 Add `"./storybook-manager"` and `"./storybook-preview"` entries to the `exports` field in `package.json`
- [ ] 3.2 Add `storybook` as an optional `peerDependency` in `package.json`

## 4. Internal Storybook Refactor

- [ ] 4.1 Update `.storybook/preview.tsx` to import `MailRendererDecorator` from `../src/storybook-preview/index.js` instead of the local decorator file
- [ ] 4.2 Delete `.storybook/MailRenderer.decorator.tsx`
- [ ] 4.3 Verify the internal Storybook starts and renders stories correctly using the library decorator

## 5. Lint and Build Verification

- [ ] 5.1 Run `pnpm run build` and verify `lib/storybook-manager/index.js` and `lib/storybook-preview/index.js` exist in the compiled output
- [ ] 5.2 Run `pnpm run lint` and fix any lint errors in the new source files

## 6. Changeset

- [ ] 6.1 Create a changeset file in `.changeset/` describing the new `storybook-manager` and `storybook-preview` sub-path exports for consumers setting up Storybook for mail development
