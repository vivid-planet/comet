---
title: Migrating from v10 to v11
sidebar_position: -11
---

# Migrating from v10 to v11

:::info AI-Assisted Migration

This migration guide is designed to be executed by an AI coding agent (e.g., Claude Code). Each section contains structured, step-by-step instructions that an agent can follow to perform the migration automatically.

**Sample prompt to get started:**

```
Migrate this project from Dextinity v10 to v11. Follow the migration guide at https://cms-docs.dextinity.com/docs/migration-guide/migration-from-v10-to-v11 step by step. Work through each section sequentially, making the required changes and running any verification commands. Commit after each major section.
```

:::

## What changes in v11

v11 replaces the linting and formatting toolchain: [Oxlint](https://oxc.rs/docs/guide/usage/linter) instead of ESLint and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) instead of Prettier.
Both are written in Rust and lint or format a project in a fraction of the time.

`@dextinity/eslint-config` ships Oxlint configurations next to its ESLint configurations, and the rules of `@dextinity/eslint-plugin` work with both linters.
Migrating the linter is therefore optional — the ESLint configurations keep working. Migrating the formatter is not: `@dextinity/api-generator` and `@dextinity/admin-generator` format the files they generate with Oxfmt.

## Migrate formatting from Prettier to Oxfmt

Oxfmt implements Prettier's algorithm, so the formatting of most files doesn't change. Expect a diff in a small share of files.

1. Add Oxfmt and remove Prettier:

    ```bash
    npm install --save-dev oxfmt
    npm uninstall prettier eslint-plugin-prettier eslint-config-prettier
    ```

2. Migrate the Prettier configuration:

    ```bash
    npx oxfmt --migrate prettier
    ```

    This writes an `.oxfmtrc.json` and reports options Oxfmt doesn't support.
    Move the entries of your `.prettierignore` to `ignorePatterns` in the config, then delete `.prettierrc*` and `.prettierignore`.

3. Replace the `lint:prettier` scripts. Oxfmt formats a whole directory, so the file globs are no longer needed:

    ```json
    {
        "scripts": {
            "lint:oxfmt": "oxfmt --check",
            "lint:fix:oxfmt": "oxfmt"
        }
    }
    ```

    Update the `lint`, `lint:fix` and `lint-staged` entries that reference the old script names.

4. Format the project once and commit the result separately:

    ```bash
    npx oxfmt
    ```

:::warning

Formatting is not part of linting anymore. If you stay on ESLint, remove `eslint-plugin-prettier` from your ESLint config — otherwise it reports every file Oxfmt formatted.

:::

## Migrate linting from ESLint to Oxlint

1. Add Oxlint and remove ESLint:

    ```bash
    npm install --save-dev oxlint
    npm uninstall eslint
    ```

    Keep `eslint-plugin-storybook` and any other ESLint plugin you use: Oxlint runs them as [JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins).

2. Replace `eslint.config.mjs` with `oxlint.config.mts`. Oxlint only discovers configuration files with a `.ts` or `.mts` extension, so use `.mts`:

    ```ts
    // In oxlint.config.mts
    import reactConfig from "@dextinity/eslint-config/oxlint/react.js";
    import { defineConfig } from "oxlint";

    export default defineConfig({
        extends: [reactConfig],
        ignorePatterns: ["src/**/*.generated.ts"],
        rules: {
            "@dextinity/no-other-module-relative-import": "off",
        },
    });
    ```

    The Oxlint configurations are available as `@dextinity/eslint-config/oxlint/core.js`, `/oxlint/nestjs.js`, `/oxlint/nextjs.js` and `/oxlint/react.js`.

3. Rename the rules you override. Oxlint's built-in plugins use shorter prefixes:

    | ESLint                      | Oxlint              |
    | --------------------------- | ------------------- |
    | `@typescript-eslint/<rule>` | `typescript/<rule>` |
    | `react-hooks/<rule>`        | `react/<rule>`      |
    | `@next/next/<rule>`         | `nextjs/<rule>`     |

    `eslint-disable` comments keep working, Oxlint understands both `eslint-disable` and `oxlint-disable`.

4. Replace the `lint:eslint` scripts:

    ```json
    {
        "scripts": {
            "lint:oxlint": "oxlint --max-warnings 0 src/",
            "lint:fix:oxlint": "oxlint --max-warnings 0 src/ --fix"
        }
    }
    ```

5. Run the linter and fix what it reports:

    ```bash
    npx oxlint --max-warnings 0 src/ --fix
    ```

### Config differences to be aware of

- **`overrides[].files` doesn't support extglobs.** Write `**/*.stories.{ts,tsx}` instead of `**/*.stories.@(ts|tsx)`.
- **`jsPlugins` is replaced, not merged.** A config that extends another one and adds a JS plugin has to repeat the plugins of the extended config:

    ```ts
    jsPlugins: [...reactConfig.jsPlugins, { name: "storybook", specifier: "eslint-plugin-storybook" }],
    ```

- **`settings.react.version` needs a concrete version.** Oxlint has no `"detect"`; omit the setting to use its default.

### Rules without an Oxlint equivalent

| Rule                                         | Replacement                                                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `eslint-plugin-prettier`                     | Oxfmt                                                                                                                    |
| `simple-import-sort/*`                       | Kept as a JS plugin. Alternatively enable `sortImports` in `.oxfmtrc.json`, which changes the order of existing imports. |
| `jsonc/*`, `package-json/*`                  | Oxlint doesn't lint JSON. Oxfmt formats JSON files and sorts `package.json` keys.                                        |
| `@graphql-eslint/naming-convention`          | `@dextinity/graphql-naming-convention`, which scans `gql` template literals instead of parsing the GraphQL document.     |
| `@typescript-eslint/consistent-type-exports` | No replacement, it needs type information.                                                                               |
| `no-return-await`                            | No replacement, `typescript/return-await` needs type information.                                                        |
| `no-restricted-syntax`                       | Write a JS plugin rule for the pattern you restrict.                                                                     |
| `import/no-extraneous-dependencies`          | [Knip](https://knip.dev/) reports unlisted dependencies.                                                                 |

:::warning `typescript/consistent-type-imports` and `emitDecoratorMetadata`

typescript-eslint skips imports that are only used as types inside a decorated declaration when `emitDecoratorMetadata` is enabled, because TypeScript emits those types as runtime metadata.
Oxlint can't do that without type information, so turning the reported imports into type imports breaks NestJS' dependency injection.

`@dextinity/eslint-config/oxlint/nestjs.js` therefore disables the rule. Disable it in every other package whose `tsconfig.json` enables `emitDecoratorMetadata`.

:::

## Rerun the generators

`@dextinity/api-generator` and `@dextinity/admin-generator` format the files they generate with Oxfmt. They read the format options from the closest `.oxfmtrc.json` or `.oxfmtrc.jsonc`.

Rerun both generators and commit the result:

```bash
npm run api-generator
npm run admin-generator
```
