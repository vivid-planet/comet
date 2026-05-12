## ADDED Requirements

### Requirement: Vitest configuration file
The package SHALL have a `vitest.config.ts` at its root that configures Vitest with `environment: "node"`, a JUnit reporter outputting to `./junit.xml`, and exclusions for `lib/**` and `node_modules/**`.

#### Scenario: Config matches monorepo conventions
- **WHEN** `vitest.config.ts` is inspected
- **THEN** it uses `environment: "node"`, has `reporters: ["default", "junit"]`, outputs JUnit to `./junit.xml`, and excludes `lib/**` and `node_modules/**`

### Requirement: Test scripts in package.json
The package SHALL define `"test": "vitest --run"` and `"test:watch": "vitest --watch"` scripts in `package.json`.

#### Scenario: Running tests via script
- **WHEN** `pnpm run test` is executed
- **THEN** Vitest runs all tests once and exits

#### Scenario: Running tests in watch mode
- **WHEN** `pnpm run test:watch` is executed
- **THEN** Vitest starts in watch mode

### Requirement: Vitest dev dependency
The package SHALL list `vitest` as a dev dependency.

#### Scenario: Vitest is available
- **WHEN** dependencies are installed
- **THEN** the `vitest` binary is available via `pnpm exec vitest`

### Requirement: JUnit output is gitignored
The file `junit.xml` SHALL be excluded from version control.

#### Scenario: JUnit file not tracked
- **WHEN** tests are run and `junit.xml` is produced
- **THEN** `git status` does not show `junit.xml` as untracked or modified
