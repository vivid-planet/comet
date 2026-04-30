## MODIFIED Requirements

### Requirement: dev-pm integration

The monorepo's `dev-pm.config.ts` SHALL include a `storybook-mail-react` entry that starts the mail-react Storybook. That entry SHALL belong to the `mail-react` dev-pm group and SHALL NOT belong to the `storybook` dev-pm group.

#### Scenario: Mail-react group starts mail Storybook

- **WHEN** a developer runs `pnpm exec dev-pm start @mail-react` from the monorepo root
- **THEN** the mail-react Storybook is started by dev-pm as part of that group

#### Scenario: Storybook group does not start mail-react Storybook

- **WHEN** a developer runs `pnpm exec dev-pm start @storybook` from the monorepo root
- **THEN** the `storybook-mail-react` process is not started as part of that group
