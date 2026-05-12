## 1. Vitest setup

- [x] 1.1 Add `vitest` as a dev dependency
- [x] 1.2 Create `vitest.config.ts` with `environment: "node"`, JUnit reporter outputting `./junit.xml`, and `lib/**`/`node_modules/**` exclusions
- [x] 1.3 Add `"test": "vitest --run"` and `"test:watch": "vitest --watch"` scripts to `package.json`

## 2. css helper test

- [x] 2.1 Create `src/utils/css.test.ts` verifying the `css-helper` spec scenarios: static template returns text exactly, interpolated template resolves values correctly

## 3. Server renderMailHtml test

- [x] 3.1 Create `src/server/renderMailHtml.test.tsx` verifying the `render-mail-html` spec's "Basic rendering" and "MJML warnings collected" scenarios: render a simple mail (`MjmlMailRoot > MjmlSection > MjmlColumn > MjmlText`) via `server/renderMailHtml`, assert the output contains `<!doctype html>`, the passed-in text, and produces no MJML warnings

## 4. Verify

- [x] 4.1 Run `pnpm run test` and confirm all tests pass
- [x] 4.2 Run `pnpm run lint` and confirm no lint errors are introduced
