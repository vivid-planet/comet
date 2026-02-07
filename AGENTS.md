# Agent Instructions

## Linting

- Run `pnpm exec eslint --fix <files>` for any modified files that are linted by ESLint before finalizing changes.

## Demo application

- Start the full demo (admin, API, site):
  ```bash
  pnpm exec dev-pm start @demo
  ```
  or
  ```bash
  pnpm run dev:demo
  ```
- Start individual demo services:
  ```bash
  pnpm exec dev-pm start @demo-api @demo-admin @demo-site
  ```

## Rebuilding packages

- Build all Comet packages:
  ```bash
  pnpm run build:packages
  ```
- Build only the packages you changed (repeat the filter as needed):
  ```bash
  pnpm --recursive --filter '<package-name>' run build
  ```

## Knip

Knip is a tool for analyzing and optimizing dependencies in a monorepo. To run knip, execute the following command in the root directory:

```bash
pnpm run lint:knip                                              # all packages
pnpm run lint:knip --workspace packages/<path/to/your/package>  # specific package
```

Knip is configured in the `knip.json` file at the root of the repository.
