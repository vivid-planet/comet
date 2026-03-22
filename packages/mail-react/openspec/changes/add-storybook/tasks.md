## 1. Dependencies and scripts

- [ ] 1.1 Add Storybook dev dependencies to `package.json`: `storybook`, `@storybook/react-vite`, `@storybook/addon-docs`, `mjml-browser`, `@types/mjml-browser`
- [ ] 1.2 Add `storybook` script (`storybook dev -p 6066 --no-open`) and `build-storybook` script to `package.json`
- [ ] 1.3 Add `storybook-static/` to `.gitignore`

## 2. Storybook configuration

- [ ] 2.1 Create `.storybook/main.ts` with `@storybook/react-vite` framework, story globs (`src/**/*.stories.tsx`, `src/**/*.mdx`), and `@storybook/addon-docs` addon
- [ ] 2.2 Create `.storybook/preview.tsx` with `MailRendererDecorator` as a global decorator

## 3. Mail renderer decorator

- [ ] 3.1 Create `.storybook/MailRenderer.decorator.tsx` that wraps stories in `<Mjml><MjmlBody>`, converts to MJML string via `renderToMjml`, converts to HTML via `mjml2html` from `mjml-browser`, and renders via `dangerouslySetInnerHTML`. Destructure `mjml2html`'s `errors` as `mjmlWarnings` (they are non-breaking warnings despite MJML's naming) and log each via `console.warn`.

## 4. MjmlSection: restructure and document

- [ ] 4.1 Move `src/components/MjmlSection.tsx` into `src/components/section/MjmlSection.tsx`
- [ ] 4.2 Update the re-export path in `src/index.ts` to point to the new location
- [ ] 4.3 Add simple TSDoc comments to `MjmlSection` component and its props (to validate autodocs)

## 5. Sample story

- [ ] 5.1 Create `src/components/section/__stories__/MjmlSection.stories.tsx` with `autodocs` tag and a few story variants (e.g., Primary, DisabledResponsiveBehavior)

## 6. dev-pm integration

- [ ] 6.1 Add `storybook-mail-react` entry to monorepo `dev-pm.config.ts` in the `"storybook"` group (no `waitOn` needed)

## 7. Codify conventions

- [ ] 7.1 Update `openspec/config.yaml`: move "Storybook stories for every custom component, documented with TSDocs" from "Future direction" to "Conventions" with the concrete structure (`src/components/<concern>/` with `__stories__/*.stories.tsx` and TSDoc on exports). Add a `tasks` rule that component changes must include story and TSDoc tasks.

## 8. Validation

- [ ] 8.1 Run `pnpm run storybook` and verify the story renders correctly and autodocs page shows TSDoc content
