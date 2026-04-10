## Why

The package has no automated tests. Other packages in the monorepo (`admin`, `cms-admin`, `cli`, `site-react`) all use Vitest. Adding a Vitest setup establishes the testing foundation and verifies two core behaviors: the `css` tagged-template helper and the server-side `renderMailHtml` pipeline.

## What Changes

- Add `vitest` as a dev dependency with a `vitest.config.ts` (Node environment, JUnit reporter — matching monorepo conventions)
- Add `"test"` and `"test:watch"` scripts to `package.json`
- Add a unit test for the `css` helper (`src/utils/css.test.ts`)
- Add an integration test for `server/renderMailHtml` (`src/server/renderMailHtml.test.tsx`)

## Capabilities

### New Capabilities

- `vitest-setup`: Vitest configuration, dev dependency, and npm scripts for running tests
- `css-helper`: Behavioral spec for the `css` tagged-template literal (does not exist yet)

### Modified Capabilities

- `render-mail-html`: Add integration test requirement for the server-side render pipeline

## Impact

- **Dependencies**: `vitest` added as dev dependency
- **Scripts**: `test` and `test:watch` added to `package.json`
- **New files**: `vitest.config.ts`, `src/utils/css.test.ts`, `src/server/renderMailHtml.test.tsx`
- **CI**: JUnit output (`junit.xml`) available for CI reporters; `junit.xml` should be gitignored
