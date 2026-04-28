## ADDED Requirements

### Requirement: Storybook configuration

The package SHALL have a `.storybook/` directory at its root containing Storybook 10 configuration using `@storybook/react-vite` as the framework.

The configuration SHALL discover stories matching `src/**/*.stories.tsx` and `src/**/*.mdx`.

The configuration SHALL include `@storybook/addon-docs` for documentation support.

#### Scenario: Storybook starts successfully

- **WHEN** a developer runs `pnpm run storybook` from the package directory
- **THEN** Storybook starts on port 6066 and serves the development UI

#### Scenario: Stories are discovered

- **WHEN** a `*.stories.tsx` file exists anywhere under `src/`
- **THEN** the story appears in the Storybook sidebar

### Requirement: Package scripts

The package SHALL have a `storybook` script that starts the Storybook dev server.

The package SHALL have a `build-storybook` script that produces a static build.

#### Scenario: Dev server script

- **WHEN** `pnpm run storybook` is executed
- **THEN** Storybook launches in development mode with hot reloading on port 6066

#### Scenario: Static build script

- **WHEN** `pnpm run build-storybook` is executed
- **THEN** a static Storybook build is produced in `storybook-static/`

### Requirement: Dev dependencies

All Storybook-related packages and `mjml-browser` SHALL be added as `devDependencies` only. They MUST NOT appear in `dependencies` or `peerDependencies`.

#### Scenario: Published package is unaffected

- **WHEN** the package is published to npm
- **THEN** none of the Storybook or mjml-browser packages are included as dependencies

### Requirement: Git ignore storybook output

The `storybook-static/` directory SHALL be listed in `.gitignore`.

#### Scenario: Build output is not tracked

- **WHEN** `pnpm run build-storybook` is executed
- **THEN** the `storybook-static/` directory is ignored by git

### Requirement: dev-pm integration

The monorepo's `dev-pm.config.ts` SHALL include a `storybook-mail-react` entry in the `"storybook"` group that starts the mail-react storybook.

#### Scenario: Storybook group starts mail storybook

- **WHEN** a developer runs `pnpm exec dev-pm @storybook` from the monorepo root
- **THEN** the mail-react storybook starts alongside the other storybooks

### Requirement: Sample story

The setup SHALL include at least one sample story for `MjmlSection` to validate that the Storybook infrastructure, mail rendering decorator, and autodocs work correctly. The story SHALL live in `src/components/section/__stories__/MjmlSection.stories.tsx`.

#### Scenario: Sample story renders

- **WHEN** a developer opens Storybook after setup
- **THEN** at least one story is visible and renders a component as HTML email output

#### Scenario: Autodocs page is generated

- **WHEN** the story uses the `autodocs` tag and the component has TSDoc comments
- **THEN** Storybook generates a docs page showing the component description and prop documentation
