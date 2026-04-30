# Admin Packages

This directory contains all admin-related packages for the Comet framework.

## Packages

| Package                     | Description                                                              |
| --------------------------- | ------------------------------------------------------------------------ |
| `@comet/admin`              | Core admin components and framework (React, MUI, Apollo, Final Form)     |
| `@comet/admin-babel-preset` | Shared Babel preset for transpiling admin packages                       |
| `@comet/admin-color-picker` | Color picker form field component                                        |
| `@comet/admin-date-time`    | Date/time picker form field components                                   |
| `@comet/admin-icons`        | SVG icon library as React components                                     |
| `@comet/admin-rte`          | Rich text editor component (Draft.js-based)                              |
| `@comet/admin-generator`    | CLI tool that generates admin CRUD UIs from GraphQL schemas              |
| `@comet/cms-admin`          | Admin UI for CMS features (pages, blocks, content management)            |
| `@comet/brevo-admin`        | Admin UI for Brevo email/marketing integration                           |

## Storybook

There are two Storybook instances relevant to admin packages:

### `@comet/admin` Storybook (package-level)

Located in `admin/.storybook/`. Contains stories specific to the core admin package.

- Stories are located in `admin/src/**/__stories__/*.stories.tsx` and `admin/src/**/*.mdx`
- Runs on port **26646**

```bash
# From packages/admin/admin/
pnpm run storybook

# Build static storybook
pnpm run build-storybook
```

### Root Storybook (repo-level)

Located in `storybook/` at the repo root. Aggregates stories across multiple Comet packages and references the `@comet/admin` Storybook.

- Runs on port **26638**

```bash
# From storybook/
pnpm run storybook
```

## Tests

All packages use **Vitest** as the test framework.

### Which packages have tests

| Package              | Test Environment | Setup File       |
| -------------------- | ---------------- | ---------------- |
| `@comet/admin`       | jsdom            | vitest.setup.ts  |
| `@comet/admin-rte`   | jsdom            | —                |
| `@comet/admin-generator` | node (default) | —            |
| `@comet/cms-admin`   | jsdom            | vitest.setup.ts  |

The remaining packages (`admin-babel-preset`, `admin-color-picker`, `admin-date-time`, `admin-icons`, `brevo-admin`) do not have tests.

### Running tests

```bash
# Run tests for a single package (from package directory)
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests from the repo root
pnpm --filter @comet/admin run test
pnpm --filter @comet/admin-rte run test
pnpm --filter @comet/admin-generator run test
pnpm --filter @comet/cms-admin run test

# Update snapshots (admin-generator only)
cd admin-generator && pnpm run test:updateSnapshot
```

### Test conventions

- Test files are co-located with source code, typically in the same directory or a `__tests__/` subdirectory
- File naming: `*.test.ts(x)` or `*.spec.ts(x)`
- Packages testing React components (`admin`, `admin-rte`, `cms-admin`) use the `jsdom` environment and `@testing-library/react`
- `admin-generator` tests use snapshot testing to verify generated output
