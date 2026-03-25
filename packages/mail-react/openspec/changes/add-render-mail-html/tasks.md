## 1. Dependencies

- [ ] 1.1 Add `mjml` as a production dependency in `package.json`
- [ ] 1.2 Move `mjml-browser` from `devDependencies` to `dependencies` in `package.json`
- [ ] 1.3 Add `@types/mjml` to `devDependencies` in `package.json`

## 2. Server sub-path

- [ ] 2.1 Create `src/server/renderMailHtml.tsx` using `mjml` for MJML-to-HTML conversion
- [ ] 2.2 Create `src/server/index.ts` barrel exporting `renderMailHtml`

## 3. Client sub-path

- [ ] 3.1 Create `src/client/renderMailHtml.tsx` using `mjml-browser` for MJML-to-HTML conversion
- [ ] 3.2 Create `src/client/index.ts` barrel exporting `renderMailHtml`

## 4. Package exports

- [ ] 4.1 Add `"./server"` and `"./client"` entries to the `exports` map in `package.json`
- [ ] 4.2 Simplify the existing `"."` export to the plain string format

## 5. Storybook decorator update

- [ ] 5.1 Update `MailRenderer.decorator.tsx` to import `renderMailHtml` from `../src/client/renderMailHtml.js` instead of directly importing `mjml-browser`

## 6. Verification

- [ ] 6.1 Build the package and verify `lib/server/` and `lib/client/` are produced
- [ ] 6.2 Run linting (`pnpm run lint`) and fix any errors

## 7. Changeset

- [ ] 7.1 Create a changeset file in `.changeset/` describing the new `renderMailHtml` function and the `/server` and `/client` sub-path exports
