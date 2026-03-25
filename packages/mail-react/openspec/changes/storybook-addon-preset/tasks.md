## 1. Preset Entry Point

- [x] 1.1 Create `src/storybook/index.ts` — exports `managerEntries()` and `previewAnnotations()` functions that return filesystem paths to sibling `manager.js` and `preview.js` using `dirname(fileURLToPath(import.meta.url))`

## 2. Preview Decorator and Annotation

- [x] 2.1 Create `src/storybook/replaceImagesWithPublicUrl.ts` — utility function that replaces `<img>` src attributes with `https://picsum.photos/seed/{seed}/{width*2}/{height*2}` based on each image's width/height attributes
- [x] 2.2 Create `src/storybook/MailRendererDecorator.tsx` — Storybook decorator that wraps stories in `<MjmlMailRoot>`, renders via `renderMailHtml` (client), applies public URL replacement when the `usePublicImageUrls` global is active, emits a single `comet-mail-render-result` channel event with `{ html, mjmlWarnings }`, and renders the HTML via `dangerouslySetInnerHTML`
- [x] 2.3 Create `src/storybook/preview.ts` — exports `decorators` array containing `MailRendererDecorator` and `initialGlobals` containing `{ usePublicImageUrls: false }`

## 3. Manager Addons

- [x] 3.1 Create `src/storybook/CopyMailHtmlButton.tsx` — toolbar button that subscribes to `comet-mail-render-result` and copies the HTML to clipboard, showing "Copied to clipboard!" for 2 seconds
- [x] 3.2 Create `src/storybook/UsePublicImageUrlsToggle.tsx` — toolbar toggle button with checkbox, tooltip, and ℹ️ emoji that controls the `usePublicImageUrls` Storybook global
- [x] 3.3 Create `src/storybook/MjmlWarningsPanel.tsx` — addon panel that subscribes to `comet-mail-render-result` and displays MJML warnings with tag name, line number, and message; panel title includes a compact badge with warning count or "✓"
- [x] 3.4 Create `src/storybook/manager.ts` — self-executing module that calls `addons.register(...)` and registers all three addons (copy HTML as tool, public URLs as tool, MJML warnings as panel)

## 4. Package Configuration

- [x] 4.1 Add `"./storybook": "./lib/storybook/index.js"` entry to the `exports` field in `package.json`
- [x] 4.2 Add `storybook` as an optional `peerDependency` (`>=10.0.0`) with `peerDependenciesMeta` in `package.json`

## 5. ESLint Configuration

- [x] 5.1 Update `eslint.config.mjs` to exempt `src/storybook/**` files from `@calm/react-intl/missing-formatted-message` and `react/jsx-no-literals` rules
- [x] 5.2 Update `eslint.config.mjs` to allow React default import in `src/storybook/**` manager-side files (needed for Storybook's manager API which expects React in scope)

## 6. Internal Storybook Refactor

- [x] 6.1 Update `.storybook/preview.tsx` to re-export `decorators` and `initialGlobals` from `../src/storybook/preview.ts`
- [x] 6.2 Delete `.storybook/MailRenderer.decorator.tsx`
- [x] 6.3 Create `.storybook/manager.tsx` that imports `../src/storybook/manager.ts` (side-effect import to register addons)
- [x] 6.4 Verify the internal Storybook starts and renders stories correctly with all three addons visible

## 7. Lint, Build, and Changeset

- [x] 7.1 Run `pnpm run build` and verify `lib/storybook/index.js`, `lib/storybook/manager.js`, and `lib/storybook/preview.js` exist
- [x] 7.2 Run `pnpm run lint` and fix any lint errors in the new source files
- [x] 7.3 Create a changeset file in `.changeset/` describing the new `@comet/mail-react/storybook` addon preset for consumers setting up Storybook for mail development
