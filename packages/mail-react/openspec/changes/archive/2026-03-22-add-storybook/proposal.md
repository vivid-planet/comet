## Why

The library currently has no way to visually develop or preview components. A local Storybook provides live rendering of MJML components during development and serves as living documentation for library consumers.

## What Changes

- Add a Storybook 10 setup using `@storybook/react-vite` for local development
- Add a `MailRendererDecorator` that converts MJML React trees to rendered HTML using `mjml-browser`, wrapping stories in `<Mjml><MjmlBody>` automatically
- Add `storybook` and `build-storybook` scripts to `package.json`
- Add `mjml-browser` and Storybook packages as dev dependencies
- Move `MjmlSection` into a `section/` directory, add TSDoc comments, and create a sample story to validate the setup and autodocs
- Register the storybook in the monorepo's dev-pm `"storybook"` group
- The storybook is local-only — not deployed or connected to other monorepo storybooks

## Capabilities

### New Capabilities

- `storybook-setup`: Storybook infrastructure (config, scripts, dependencies, gitignore)
- `mail-renderer-decorator`: Decorator that renders MJML React components to HTML for display in Storybook stories

### Modified Capabilities

_(none)_

## Impact

- **Dependencies**: New devDependencies (`storybook`, `@storybook/react-vite`, `@storybook/addon-docs`, `mjml-browser`, `@types/mjml-browser`)
- **Scripts**: New `storybook` and `build-storybook` scripts in `package.json`
- **Files**: New `.storybook/` directory at package root, `.gitignore` update for `storybook-static/`
- **Published package**: No impact — all additions are devDependencies and excluded from `files`
- **Existing API**: No changes to any exported components or types
