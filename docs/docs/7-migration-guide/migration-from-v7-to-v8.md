---
title: Migrating from v7 to v8
sidebar_position: -8
---

# Migrating from v7 to v8

The following sections go over all necessary changes.
They also give recommendations on how to structure your PRs and commits.

:::warning
Many changes can be handled by upgrade scripts. **Use them!**

The 🤖 emoji marks changes that can be handled by an upgrade script.
You just have to execute the script.
Below the command there usually is a details drawer that describes the changes made.
:::

## Prerequisites

There are some steps that are necessary for the COMET v8 update but can be done beforehand:

### Step 1: Upgrade node to v22 (PR #1)

:::info
You can skip this step if your project already uses node v22
:::

**Create a branch `node-22`.**
Then make the following changes:

#### 🤖 In development:

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/replace-node-with-v22-locally.ts
```

:::

<details>
```diff title=.nvmrc
- 20
+ 22
```

```diff title=package.json
- "@types/node": "^20.0.0",
+ "@types/node": "^22.0.0",
```

</details>

#### 🤖 In pipeline and deployment:

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/replace-node-with-v22-in-gitlab-ci-files.ts
```

:::

<details>
Make sure you use Node 22 in your CI files.
When using Gitlab CI, check all files in the .gitlab-ci folders.
Make sure to extend the correct jobs and replace all images and base images.

```diff
- extends: .lint-npm-node20
+ extends: .lint-npm-node22

- BASE_IMAGE: "ubi/s2i-ubi9-nodejs20-minimal"
+ BASE_IMAGE: "ubi/s2i-ubi9-nodejs22-minimal"

- image: eu.gcr.io/vivid-planet/utils/ubi9-nodejs20-minimal:master
+ image: eu.gcr.io/vivid-planet/utils/ubi9-nodejs22-minimal:master
```

</details>

**Now open a PR from `node-22` to `main`**

### Step 2: Update Typescript to v5 (PR #2)

:::info
You can skip this step if your project already uses typescript v5 **everywhere**
:::

**Create a branch `typescript-5`.**

1. Make the following changes:

    ```diff title="package.json"
    -        "typescript": "^4.2.3",
    +        "typescript": "^5.9.3",
    ```

    ```diff title="api/package.json"
    -        "typescript": "^4.2.3",
    +        "typescript": "^5.9.3",
    ```

    ```diff title="admin/package.json"
    -        "typescript": "^4.2.3",
    +        "typescript": "^5.9.3",
    ```

    ```diff title="site/package.json"
    -        "typescript": "^4.2.3",
    +        "typescript": "^5.9.3",
    ```

2. Execute `npm install` in each folder (`/api`, `/admin`, `/site`, `/`)

    Check carefully for errors during the install.
    Errors might occur because of other packages that depend on typescript v4.
    Update such packages to make the errors disappear.

3. Execute `npm run lint` in the root directory.

    Fix occurring errors.

    You might also see a warning like this:

    ```
    =============

    WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.

    You may find that it works just fine, or you may not.

    SUPPORTED TYPESCRIPT VERSIONS: >=3.3.1 <5.2.0

    YOUR TYPESCRIPT VERSION: 5.9.3

    Please only submit bug reports when using the officially supported version.

    =============
    ```

    Ignore this warning for now.

4. Check if the app still starts

**Now open a PR from `typescript-5` to `main`**

### Step 3: Switch from `@comet/cms-site` to `@comet/site-nextjs` (PR #3)

:::info
You can skip this step if your project doesn't have a site
:::

:::warning
This doesn't work if you use other packages that depend on `@comet/cms-site`.
In that case, skip this step for now and do it later during the v8 update.
:::

The `@comet/cms-site` package has been reworked and renamed to `@comet/site-nextjs`. Notable changes are

- Styled components is no longer a required peer dependency
- Instead, SCSS modules are used internally
- The package is now pure ESM

To switch you must

1. Create a branch `switch-to-site-nextjs`
2. `cd site`
3. `npm uninstall @comet/cms-site`
4. `npm install @comet/site-nextjs@7`
5. Change all imports from `@comet/cms-site` to `@comet/site-nextjs` (with search and replace in your IDE)
6. Import the css file exported by the package:

    ```diff title="site/src/app/layout.tsx"
    + import "@comet/site-nextjs/css";
    ```

7. Switch the package in `optimizePackageImports`:

    ```diff title="site/next.config.mjs"
    const nextConfig = {
        // ...
        experimental: {
            instrumentationHook: true,
    -       optimizePackageImports: ["@comet/cms-site"],
    +       optimizePackageImports: ["@comet/site-nextjs"],
        },
        // ...
    }
    ```

**Now open a PR from `switch-to-site-nextjs` to `main`**

### Step 4: Update eslint and prettier (PR #4)

**Create a branch `update-eslint-to-v9`**

#### 🤖 Upgrade ESLint from v8 to v9 with ESM

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/eslint-dev-dependencies.ts
```

:::

<details>

<summary>Handled by @comet/upgrade</summary>

Update ESLint to v9

`package.json`

```diff
- "eslint": "^8.0.0",
+ "eslint": "^9.0.0",
```

An ESM compatible ESLint config is required. Delete the related `.eslintrc.json` and move the configured rules to the new ESLint flat configuration `eslint.config.mjs`.

Migration Guide of ESLint 9.0 can be found here: [Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)

##### `admin/eslint.config.mjs`

```
import cometConfig from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["schema.json", "src/fragmentTypes.json", "dist/**", "src/**/*.generated.ts"],
    },
    ...cometConfig
];

export default config;
```

##### `api/eslint.config.mjs`

```
import cometConfig from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
import cometConfig from "@comet/eslint-config/nestjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts"],
    },
    ...cometConfig,
];

export default config;
```

##### `site/eslint.config.mjs`

```
import cometConfig from "@comet/eslint-config/react.js";

/** @type {import('eslint')} */
import cometConfig from "@comet/eslint-config/nextjs.js";

/** @type {import('eslint')} */
const config = [
    {
        ignores: ["**/**/*.generated.ts", "dist/**", "lang/**", "lang-compiled/**", "lang-extracted/**", ".next/**", "public/**"],
    },
    ...cometConfig,
];

export default config;

```

</details>

After executing the script, create a commit with `--no-verify`.

#### Migrate custom eslint rules

:::warning

The upgrade script only creates a simple version of the new `eslint.config.mjs`.
It adds the old config from `.eslintrc.json` to the new file as a comment at the top.
You must now manually go through all the eslint configs and migrate your custom rules (if you have any).

:::

1. Check `api/eslint.config.mjs`, `admin/eslint.config.mjs` and `site/eslint.config.mjs`
2. Migrate custom rules
3. Remove the comment from the file
4. Create a commit with `--no-verify`

#### 🤖 Upgrade Prettier from v2 to v3

:::note Execute the following upgrade script

```sh
npx @comet/upgrade@latest v8/prettier-dev-dependencies.ts
```

:::

<details>

<summary>Handled by @comet/upgrade</summary>

```diff
-        "prettier": "^2.8.1",
+        "prettier": "^3.4.2",
```

</details>

After executing the script, create a commit with `--no-verify`.

#### Upgrade `@comet/eslint-config` to v8

Yes, you can do that before updating everything else to v8.

1. Change the version numbers:

    ```diff title="api/package.json"
    -       "@comet/eslint-config": "7.24.0",
    +       "@comet/eslint-config": "8.0.0", // replace with the newest v8 version
    ```

    ```diff title="admin/package.json"
    -       "@comet/eslint-config": "7.24.0",
    +       "@comet/eslint-config": "8.0.0", // replace with the newest v8 version
    ```

    ```diff title="site/package.json"
    -       "@comet/eslint-config": "7.24.0",
    +       "@comet/eslint-config": "8.0.0", // replace with the newest v8 version
    ```

2. Execute `npm install` (it might be necessary to use `npm install --force`)
3. Create a commit with `--no-verify`

#### API

1. Run `npm run lint:eslint -- --fix` to autofix all fixable issues
2. Commit your changes with `--no-verify`
3. Run `npm run lint` and manually fix all open issues
4. Commit your changes with `--no-verify`

#### Admin

1. Run `npm run lint:eslint -- --fix` to autofix all fixable issues
2. Commit your changes with `--no-verify`
3. Add `react-jsx` to your `tsconfig.json`:

    ```diff
    -       "jsx": "react",
    +       "jsx": "react-jsx",
    ```

4. 🤖 Remove React barrel imports

    Importing `React` is no longer necessary due to the new JSX transform, which automatically imports the necessary `react/jsx-runtime` functions.
    Use individual named imports instead, e.g, `import { useState } from "react"`.

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/remove-react-barrel-imports-admin.ts
    ```

    :::

5. Commit your changes with `--no-verify`

6. 🤖 Ignore import restrictions for `@mui/material` (this is done temporarily, we'll fix this later during the v8 update)

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/ignore-restricted-imports-admin.ts
    ```

    :::

7. Commit your changes with `--no-verify`
8. Run `npm run lint` and manually fix all open issues
9. Commit your changes with `--no-verify`

#### Site

1. Run `npm run lint:eslint -- --fix` to autofix all fixable issues
2. Commit your changes with `--no-verify`
3. 🤖 Remove React barrel imports

    Importing `React` is no longer necessary due to the new JSX transform, which automatically imports the necessary `react/jsx-runtime` functions.
    Use individual named imports instead, e.g, `import { useState } from "react"`.

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/remove-react-barrel-imports-site.ts
    ```

    :::

4. Commit your changes with `--no-verify`
5. Run `npm run lint` and manually fix all open issues
6. Commit your changes **without** `--no-verify`. There should be no remaining errors.

**Now open a PR from `update-eslint-to-v9` to `main`**

## Update process

Once all the above PRs are merged, you can now start the actual v8 update.
We recommend doing it service-by-service like this:

1. Root
2. API
    1. Update the versions in package.json
    2. Execute `npm install`
    3. Execute all the steps in the migration guide. Commit with `--no-verify` after each step
    4. Run `npm run lint` and fix all remaining errors
    5. Start the API. Fix runtime errors if there are any.
3. Repeat for admin
4. Repeat for site

## Root

1. Create a `update-to-comet-v8` branch
2. Open the root `package.json`
3. Change the version for `@comet/cli`:

    ```diff
    - "@comet/cli": "7.25.4",
    + "@comet/cli": "8.0.0", // replace with the newest v8 version
    ```

4. Execute `npm install`
5. Execute `npm run create-site-configs-env`
6. Create a commit

## API

Before installing, we must update the following dependency versions:

### 🤖 Upgrade peer dependencies

The following upgrade script will update peer dependency versions and make some minor changes in the code.

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/api/before-install
```

:::

<details>

<summary>Updates handled by this batch upgrade script</summary>

#### ✅ NestJS

Upgrade all your dependencies to support NestJS v11

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/api/before-install/update-nest-dependencies.ts
```

:::

```diff title=api/package.json
{
    "dependencies": {
+       "@apollo/server": "^5.1.0",
+       "@as-integrations/express5": "^1.1.2",
-       "@nestjs/apollo": "^10.0.0",
-       "@nestjs/common": "^9.0.0",
-       "@nestjs/config": "^2.0.0",
-       "@nestjs/core": "^9.0.0",
-       "@nestjs/graphql": "^10.0.0",
-       "@nestjs/passport": "^9.0.0",
-       "@nestjs/platform-express": "^9.0.0",
+       "@nestjs/apollo": "^13.2.1",
+       "@nestjs/common": "^11.0.0",
+       "@nestjs/core": "^11.0.0",
+       "@nestjs/graphql": "^13.0.0",
+       "@nestjs/passport": "^11.0.0",
+       "@nestjs/platform-express": "^11.0.0",
-       "apollo-server-core": "^3.0.0",
-       "apollo-server-express": "^3.0.0",
-       "express": "^4.0.0",
+       "express": "^5.0.0",
-       "graphql": "^15.0.0",
+       "graphql": "^16.10.0",
    },
    "devDependencies": {
-       "@nestjs/cli": "^9.0.0",
-       "@nestjs/schematics": "^9.0.0",
-       "@nestjs/testing": "^9.0.0",
+       "@nestjs/cli": "^11.0.0",
+       "@nestjs/schematics": "^11.0.0",
+       "@nestjs/testing": "^11.0.0",
-       "@types/express": "^4.0.0",
+       "@types/express": "^5.0.0",
    }
}
```

</details>

#### ✅ Fix peer dependency conflict and knip problems caused by `@apollo/server`

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/api/before-install/add-apollo-server-override.ts
```

:::

```diff title="api/package.json"
+    "overrides": {
+        "@apollo/server-plugin-landing-page-graphql-playground": {
+            "@apollo/server": "^5.0.0"
+        }
+    },
```

If you are using knip:

```diff title="api/knip.json"
    "ignoreDependencies": [
        "@mikro-orm/cli",
        "jest-junit",
+       "@as-integrations/express5"
    ],
```

</details>

#### ✅ Add NestJS peer dependencies

Peer dependencies defined by NestJS have been added as peer dependencies to `@comet/cms-api`.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/api/before-install/nest-peer-dependencies.ts
```

:::

To upgrade, install the dependencies in your project:

```diff title=api/package.json
{
    "dependencies": {
+       "class-transformer": "^0.5.1",
-       "reflect-metadata": "^0.1.13",
+       "reflect-metadata": "^0.2.2",
-       "rxjs": "^7.0.0",
+       "rxjs": "^7.8.1",
    }
}
```

</details>

#### ✅ MikroORM

Upgrade all MikroORM dependencies to v6.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/api/before-install/update-mikro-orm-dependencies.ts
```

:::

```diff title=api/package.json
{
    "dependencies": {
-   "@mikro-orm/cli": "^5.9.8",
-   "@mikro-orm/core": "^5.9.8",
-   "@mikro-orm/migrations": "^5.9.8",
-   "@mikro-orm/nestjs": "^5.2.3",
-   "@mikro-orm/postgresql": "^5.9.8",
+   "@mikro-orm/cli": "^6.4.0",
+   "@mikro-orm/core": "^6.4.0",
+   "@mikro-orm/migrations": "^6.4.0",
+   "@mikro-orm/nestjs": "^6.0.2",
+   "@mikro-orm/postgresql": "^6.4.0",
    },
}
```

</details>

#### ✅ class-validator

The class-validator peer dependency has been bumped to v0.14.0.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/api/before-install/update-class-validator.ts
```

:::

```diff title=api/package.json
{
    "dependencies": {
-       "class-validator": "0.13.2",
+       "class-validator": "^0.14.0",
    }
}
```

</details>

#### ✅ Sentry

The Sentry dependency has been bumped to v9.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/api/before-install/update-sentry.ts
```

:::

1. Upgrade the "@sentry/node" dependency in your `package.json` file:

    ```diff title=api/package.json
    {
        "dependencies": {
    -       "@sentry/node": "^7.0.0",
    +       "@sentry/node": "^9.0.0",
        },
    }
    ```

2. Update your `main.ts` file to remove all `Sentry.Handlers` and add `Sentry.setupExpressErrorHandler(app)`:

    ```diff
    -   app.use(Sentry.Handlers.requestHandler());
    -   app.use(Sentry.Handlers.tracingHandler());
    -   app.use(Sentry.Handlers.errorHandler());
    +   Sentry.setupExpressErrorHandler(app);
    ```

None of the other breaking changes in `@sentry/node` should affect us. If you still encounter problems, consult the official migration guides:

- [Migration from v7 to v8](https://docs.sentry.io/platforms/javascript/guides/node/migration/v7-to-v8/)
- [Migration from v8 to v9](https://docs.sentry.io/platforms/javascript/guides/node/migration/v8-to-v9/)

</details>

#### ✅ `@kubernetes/client-node`

The `@kubernetes/client-node` peer dependency has been bumped to v1.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/api/before-install/update-kubernetes-client-node.ts
```

:::

```diff title=api/package.json
{
    "dependencies": {
-       "@kubernetes/client-node": "^0.18.0",
+       "@kubernetes/client-node": "^1.0.0",
    }
}
```

</details>

#### ✅ Remove `@comet/blocks-api`

The `@comet/blocks-api` package has been merged into the `@comet/cms-api` package.

<details>

<summary>Handled by @comet/upgrade</summary>

To upgrade, perform the following steps:

Remove the package:

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/api/before-install/remove-blocks-packages-api.ts
    ```

    :::

    ```diff title="api/package.json"
    - "@comet/blocks-api": "^7.x.x",
    ```

</details>

#### ✅ Remove nestjs-console and install nest-commander

The [nestjs-console](https://github.com/Pop-Code/nestjs-console) package isn't actively maintained anymore.
We therefore replace it with [nest-command](https://nest-commander.jaymcdoniel.dev/).

The upgrade script will remove the `nestjs-console` package and install `nest-commander` and `@types/inquirer`.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/api/before-install/replace-nestjs-console-with-nest-commander.ts
```

:::

1. Uninstall `nestjs-console`
2. Install `nest-commander` and `@types/inquirer`
 </details>

#### ✅ Remove passport

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/api/before-install/remove-passport.ts
```

:::

Remove all passport-dependencies and add @nestjs/jwt

```diff title=api/package.json
{
    "dependencies": {
-       "@nestjs/passport": "^9.0.0",
-       ...other passport dependencies
+       "@nestjs/jwt": "^10.2.0",
    }
}
```

</details>

</details>

### API Generator - Add new package @comet/api-generator

The API Generator has been moved into a separate package `@comet/api-generator`.

```diff title="api/package.json"
devDependencies: {
+  "@comet/api-generator": "8.0.0", // replace with newest v8 version
}
```

### Install

Now it's time to run npm install:

1. Enter the /api folder: `cd api`
2. Delete `node_modules` and `package-lock.json` to avoid false positive errors: `rm package-lock.json && rm -rf node_modules`
3. Update `@comet/` packages to the newest v8 version. You can find the latest release on [Github](https://github.com/vivid-planet/comet/releases).
4. `npm install`

    :::warning ‼️ It's likely that the install fails ‼️
    The upgrade scripts only updates the packages we have in the starter.
    You probably have more packages that rely on NestJS or MikroORM in your project.
    **Update them by hand based on the errors you are getting and rerun the install!**
    :::

5. Once the install passed, commit your changes with `--no-verify`

### NestJS-related changes

1. 🤖 Update the custom `formatError` function to hide GraphQL field suggestions

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/api/after-install/update-graphql-format-error.ts
    ```

    :::

    <details>

    ```diff title=api/src/app.module.ts
    - import { ValidationError } from "apollo-server-express";
    + import { ValidationError } from "@nestjs/apollo";

    /* ... */

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
        /* ... */
        useFactory: (moduleRef: ModuleRef) => ({
            /* ... */,
            formatError: (error) => {
                // Disable GraphQL field suggestions in production
                if (process.env.NODE_ENV !== "development") {
    -               if (error instanceof ValidationError) {
    +               if (error.extensions?.code === "GRAPHQL_VALIDATION_FAILED") {
                        return new ValidationError("Invalid request.");
                    }
                }
                return error;
            },

        }),
    }),
    ```

    </details>

2. You may need to update some of your routes to support Express v5.
   See the [migration guide](https://docs.nestjs.com/migration-guide#express-v5) for more information.

### MikroORM-related changes

Follow the official [migration guide](https://mikro-orm.io/docs/upgrading-v5-to-v6) to upgrade.

We provide upgrade scripts for basic migrations.
**Please note that these scripts might not cover all necessary migrations.**

1. 🤖 Remove generic from `BaseEntity`:

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/api/after-install/mikro-orm-base-entity-generic.ts
    ```

    :::

2. 🤖 Rename `customType` to `type`:

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/api/after-install/mikro-orm-custom-type.ts
    ```

    :::

3. 🤖 Rename `onDelete` to `deleteRule`:

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/api/after-install/mikro-orm-delete-rule.ts
    ```

    :::

4. 🤖 Add a `mikro-orm` script with a dotenv call to `package.json`:

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/api/after-install/mikro-orm-dotenv.ts
    ```

    :::

5. 🤖 Change all imports from `@mikro-orm/core` to `@mikro-orm/postgresql`:

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/api/after-install/mikro-orm-imports.ts
    ```

    :::

6. 🤖 Wrap config in `defineConfig`:

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/api/after-install/mikro-orm-ormconfig.ts
    ```

    :::

7. 🤖 Replace `UseRequestContext` with `CreateRequestContext`:

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/api/after-install/mikro-orm-create-request-context.ts
    ```

    :::

### 🤖 Replace `@comet/blocks-api` imports with `@comet/cms-api`

The `@comet/blocks-api` package has been merged into the `@comet/cms-api` package.
Thus, all imports must be updated.

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/api/after-install/merge-blocks-api-into-cms-api.ts
```

:::

<details>

To upgrade, perform the following steps:

1. Update all your imports from `@comet/blocks-api` to `@comet/cms-api`

2. Update imports that have been renamed

3. Remove usages of removed export `getFieldKeys` (probably none)

</details>

### Execute API generator

```shell
npm run api-generator
```

### 🤖 Use graphiql instead of GraphQL Playground:

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/api/after-install/replace-playground-with-graphiql.ts
```

:::

### 🤖 Change s3 blob-storage config structure

It's now possible to configure the S3-client completely.

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/api/after-install/update-s3-config.ts
```

:::

<details>

Previously configuration had its own structure, now credentials are nested under `credentials` and the `accessKeyId` and `secretAccessKey` are no longer top-level properties. Bucket is not part of s3-config but still required, so it's passed as a top-level property.

```diff title=api/src/config/config.ts
blob: {
    storage: {
        driver: envVars.BLOB_STORAGE_DRIVER,
        file: {
            path: envVars.FILE_STORAGE_PATH,
        },
        azure: {
            accountName: envVars.AZURE_ACCOUNT_NAME,
            accountKey: envVars.AZURE_ACCOUNT_KEY,
        },
        s3: {
            region: envVars.S3_REGION,
            endpoint: envVars.S3_ENDPOINT,
            bucket: envVars.S3_BUCKET,
-            accessKeyId: envVars.S3_ACCESS_KEY_ID,
-            secretAccessKey: envVars.S3_SECRET_ACCESS_KEY,
+            credentials: {
+                 accessKeyId: envVars.S3_ACCESS_KEY_ID,
+                 secretAccessKey: envVars.S3_SECRET_ACCESS_KEY,
+            },
        },
    },
    storageDirectoryPrefix: envVars.BLOB_STORAGE_DIRECTORY_PREFIX,
},
```

</details>

### 🤖 Add `ImgproxyModule` and change config of `BlobStorageModule` and `DamModule`

The `FileUploadsModule` has been completely separated from the `DamModule` and now works independently.
Some structural changes were necessary to achieve this.

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/api/after-install/move-maxSrcResolution-in-comet-config.ts
npx @comet/upgrade@latest v8/api/after-install/update-dam-configuration.ts
```

:::

<details>

You need to modify your `AppModule` as follows:

```diff title="api/src/app.module.ts"
    BlobStorageModule.register({
        backend: config.blob.storage,
+       cacheDirectory: `${config.blob.storageDirectoryPrefix}-cache`,
    }),
+   ImgproxyModule.register(config.imgproxy),
    DamModule.register({
        damConfig: {
-           apiUrl: config.apiUrl,
            secret: config.dam.secret,
            allowedImageSizes: config.dam.allowedImageSizes,
            allowedAspectRatios: config.dam.allowedImageAspectRatios,
            filesDirectory: `${config.blob.storageDirectoryPrefix}-files`,
-           cacheDirectory: `${config.blob.storageDirectoryPrefix}-cache`,
            maxFileSize: config.dam.uploadsMaxFileSize,
+           maxSrcResolution: config.dam.maxSrcResolution,
        },
-       imgproxyConfig: config.imgproxy,
        Scope: DamScope,
        File: DamFile,
        Folder: DamFolder,
    }),
```

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/api/after-install/move-maxSrcResolution-in-comet-config.ts
```

:::

```diff title="api/src/comet-config.json"
{
    "dam": {
        "allowedImageAspectRatios": ["16x9", "4x3", "3x2", "3x1", "2x1", "1x1", "1x2", "1x3", "2x3", "3x4", "9x16"],
+       "maxSrcResolution": 70,
        "uploadsMaxFileSize": 500
    },
    "images": {
        "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        "imageSizes": [16, 32, 48, 64, 96, 128, 256, 320, 384]
    },
    "imgproxy": {
-       "maxSrcResolution": 70,
        "quality": 80
    }
}
```

</details>

### Import tracing with `import` instead of `require`

```diff title="src/main.ts"
if (process.env.TRACING_ENABLED === "1") {
-   require("./tracing");
+   import("./tracing");
}

// ...
```

```diff title="src/console.ts"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tracing: any;
if (process.env.TRACING_ENABLED) {
-   tracing = require("./tracing");
+   tracing = import("./tracing");
}
```

### Replace nestjs-console with nest-commander

The [nestjs-console](https://github.com/Pop-Code/nestjs-console) package isn't actively maintained anymore.
We therefore replace it with [nest-command](https://nest-commander.jaymcdoniel.dev/).

You have to perform the following steps manually:

1. Update `api/src/console.ts` to use `nest-commander`. Minimum example:

    ```ts title="api/src/console.ts2
    import { CommandFactory } from "nest-commander";

    import { AppModule } from "./app.module";
    import { createConfig } from "./config/config";

    const config = createConfig(process.env);

    async function bootstrap() {
        const appModule = AppModule.forRoot(config);

        // @ts-expect-error CommandFactory doesn't except DynamicModule, only Type<any>
        await CommandFactory.run(appModule, {
            logger: ["error", "warn", "log"],
            serviceErrorHandler: async (error) => {
                console.error(error);
                process.exit(1);
            },
        });
    }

    bootstrap();
    ```

2. Update your commands to the new `nest-commander` syntax:

#### Migrating nestjs-console commands to nest-commander

This section highlights the necessary changes to convert a nestjs-console command to nest-commander.

1. Replace the `@Console()` decorator with `@Command()`:

    ```diff
    - import { Command, Console } from "nestjs-console";
    + import { Command } from "nest-commander";

    - @Injectable()
    - @Console()
    + @Command({
    +     name: "fixtures",
    +     description: "Create fixtures with faker.js",
    + })
    export class FixturesConsole {
    -   @Command({
    -       command: "fixtures",
    -       description: "Create fixtures with faker.js",
    -   })
        @CreateRequestContext()
        async execute(): Promise<void> {
            /* ... */
        }
    }
    ```

2. Extend `CommandRunner`:

    ```diff
    + import { CommandRunner } from "nest-commander";

    - export class FixturesConsole {
    + export class FixturesConsole extends CommandRunner {
        /* ... */
    }
    ```

3. Add a `super()` call to the constructor:

    ```diff
    export class FixturesConsole extends CommandRunner {
        constructor(@Inject(CONFIG) private readonly config: Config) {
    +       super();
        }
    }
    ```

4. Rename the executing function to `run`:

    ```diff
    export class FixturesConsole extends CommandRunner {
        @CreateRequestContext()
    -   async execute(): Promise<void> {
    +   async run(): Promise<void> {
            /* ... */
        }
    }
    ```

5. If necessary, migrate arguments and options.

    **Arguments:** Move from `command` field into `arguments` field:

    :::info
    Optional arguments must be defined in square brackets `[]`, required arguments in angle brackets `<>`.
    :::

    ```diff title="import-redirects.command.ts"
    @Command({
        name: "import-redirects",
    +   arguments: "<filepath> [comment]",
        description: "Import redirects from a CSV file",
    })
    export class ImportRedirectsCommand extends CommandRunner {
        @Command({
    -       command: "import-redirects [filepath] [comment]",
            description: "Import redirects from csv file",
        })
        @CreateRequestContext()
    -   async execute(filepath: string, comment = "Imported"): Promise<void> {
    +   async run([filepath, comment = "Imported"]: string[]): Promise<void> {
            /* ... */
        }
    }
    ```

    **Options:** Use the `@Option()` decorator:

    ```diff title="refresh-block-index-views.command.ts"
    @Command({
        name: "refreshBlockIndexViews",
    })
    export class RefreshBlockIndexViewsCommand extends CommandRunner {
        @Command({
            command: "refreshBlockIndexViews",
    -       options: [
    -           {
    -               flags: "-f, --force [boolean]",
    -               defaultValue: false,
    -           },
    -       ],
        })
        @CreateRequestContext()
    -   async refreshBlockIndexViews(args: { force: boolean }): Promise<void> {
    +   async run(arguments: string[], options: { force?: true }): Promise<void> {
            /* ... */
        }

    +   @Option({
    +       flags: "-f, --force",
    +   })
    +   parseForce() {}
    }
    ```

    Review [the documentation](https://nest-commander.jaymcdoniel.dev/en/features/commander/) for more information.

6. Optional: Rename console to command:

    ```diff title="fixtures.command.ts
    - export class FixturesConsole extends CommandRunner {
    + export class FixturesCommand extends CommandRunner {
        /* ... */
    }
    ```

### Remove passport

The passport dependencies were removed before the install. The following steps must be done manually:

:::info
If you're unsure about how to structure the AuthModule, look at the [COMET Starter version](https://github.com/vivid-planet/comet-starter/blob/main/api/src/auth/auth.module.ts).
:::

1. Rename the `strategy`-factories and wrap them in `...createAuthGuardProviders()`:

    ```diff title=api/src/auth/auth.module.ts
    -   createStaticCredentialsBasicStrategy({ ... }),
    -   createAuthProxyJwtStrategy({ ... }),
    -   createStaticAuthedUserStrategy({ ... }),
    +   ...createAuthGuardProviders(
    +       createBasicAuthService({ ... }),
    +       createJwtAuthService({ ... }),
    +       createStaticUserAuthService({ ... }),
    +   ),
    ```

    :::note Configuration changes
    The configuration of the AuthServices have changed slightly compared to the strategies, however they remain similar. Consulting the code completion should help to adapt.
    :::

2. Add the new `createSitePreviewAuthService`:

    ```diff title=api/src/auth/auth.module.ts
        ...createAuthGuardProviders(
            // ...
    +       createSitePreviewAuthService({ ... }),
        ),
    ```

3. Replace `createCometAuthGuard` with the class name:

    ```diff title=api/src/auth/auth.module.ts
    -   useClass: createCometAuthGuard([...]),
    +   useClass: CometAuthGuard,
    ```

    :::note Passport not supported anymore
    `CometAuthGuard` does not support Passport strategies anymore. Consider rewriting or wrapping into `AuthServiceInterface`. However, you still can use passport strategies in conjunction with the provided `AuthGuard` from `@nestjs/passport`.
    :::

4. Remove `currentUser` prop from `createAuthResolver`:

    ```diff
     createAuthResolver({
        // ...
    -   currentUser: CurrentUser,
     }),
    ```

5. Import `JwtModule` from `@nestjs/jwt`:

    ```diff title=api/src/auth/auth.module.ts
        exports: [UserService, AccessControlService],
    +   imports: [JwtModule],
    ```

### Use strings for date-only columns

:::warning
This change only applies to **date-only** columns, meaning columns where we only want to save the date **without a time**.

It does not apply to timestamps, where we save the date and time (e.g., `createdAt` or `updatedAt`).
For these cases, you don't have to change anything.
:::

Starting with v6 MikroORM maps date-only columns to `string` instead of `Date`.
Perform the following changes:

1. Use `string` instead of `Date` for date-only columns:

    ```diff
    class Product {
        @Property({ type: types.date, nullable: true })
        @Field(() => GraphQLDate, { nullable: true })
    -   availableSince?: Date = undefined;
    +   availableSince?: string = undefined;
    }
    ```

2. Use `GraphQLLocalDate` instead of `GraphQLDate`:

    ```diff
    - import { GraphQLDate } from "graphql-scalars";
    + import { GraphQLLocalDate } from "graphql-scalars";

    class Product {
        @Property({ type: types.date, nullable: true })
    -   @Field(() => GraphQLDate, { nullable: true })
    +   @Field(() => GraphQLLocalDate, { nullable: true })
        availableSince?: string = undefined;
    }
    ```

    :::info Why this change?

    The `GraphQLDate` scalar coerces strings (e.g., `2025-06-30`) to `Date` objects when used as an input type, whereas the `GraphQLLocalDate` performs no type coercion.

    :::

### Pass metadata to `gqlArgsToMikroOrmQuery`

You now need to pass the entity metadata instead of the repository to `gqlArgsToMikroOrmQuery`:

```diff title="src/**/your.resolver.ts"
-       const where = gqlArgsToMikroOrmQuery({ filter, search }, this.repository);
+       const where = gqlArgsToMikroOrmQuery({ filter, search }, this.entityManager.getMetadata(YourEntity));
```

### Typed Permissions System

Search for all `@CrudGenerator` or `@RequiredPermission` decorators and move all permissions into the AppPermission enum. Add also module augmentation for `PermissionOverrides` to include the new `AppPermission` enum.

1. Create a new `AppPermission` enum:

    ```typescript title="api/src/auth/app-permission.enum.ts"
    export enum AppPermission {
        news = "news",
        products = "products",
        manufacturers = "manufacturers",
    }
    ```

2. Add `AppPermission` to `UserPermissionsModule`:

    ```diff title="api/src/app.module.ts"
    UserPermissionsModule.forRootAsync({
        useFactory: (userService: UserService, accessControlService: AccessControlService) => ({
            ...
        }),
        inject: [UserService, AccessControlService],
        imports: [authModule],
    +   AppPermission,
    }),
    ```

3. Create a new file and add module augmentation for `PermissionOverrides`:

    ```typescript title="api/src/auth/permission.interface.ts"
    import { type AppPermission } from "@src/auth/app-permission.enum";

    declare module "@comet/cms-api" {
        export interface PermissionOverrides {
            app: AppPermission;
        }
    }
    ```

4. Update all `@CrudGenerator` decorators where required permissions are not defined:

    ```diff title="api/src/news/entities/news.entity.ts"
    -@CrudGenerator({ targetDirectory: `${__dirname}/../generated/` })
    +@CrudGenerator({ targetDirectory: `${__dirname}/../generated/`, requiredPermission: ["news"] })
    ```

5. In admin, also add module augmentation for `PermissionOverrides` with created types from GraphQL Codegen:

    ```diff title="demo/admin/src/App.tsx"
    +import type { GQLPermission } from "@src/graphql.generated";
    ...
    declare module "@comet/cms-admin" {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface ContentScope extends BaseContentScope {}
    +
    +   export interface PermissionOverrides {
    +       permission: GQLPermission;
    +   }
    }
    ```

### API Generator - Removed Special `status` Field Behavior

Previously, if entities specified a `status` enum, it was automatically added to list queries arguments with a default value.

This special handling has been removed. The `status` field now behaves like a normal enum. Filtering by `status` can be
done with the normal filtering mechanism.

### API Generator - Don't commit generated files

The improved performance of API Generator doesn't make it necessary anymore to add generated files to git.
You can remove previously generated files and generate them on demand:

1. Run api-generator in prebuild:

    ```diff title="api/package.json"
    scripts: {
    -  "prebuild": "rimraf dist",
    +  "prebuild": "rimraf dist && npm run api-generator",
    }
    ```

2. Remove `lint:generated-files-not-modified` and execute `npm run api-generator` before lint:

    ```diff title="api/package.json"
    scripts: {
    -  "lint:generated-files-not-modified": "npm run api-generator && git diff --exit-code HEAD -- src/**/generated",
    -  "lint": "npm run lint:eslint && npm run lint:tsc",
    -  "lint:ci": "npm run lint && npm run lint:generated-files-not-modified",
    +  "lint": "npm run api-generator && run-p lint:eslint lint:tsc",
    +  "lint:ci": "npm run lint",
    }
    ```

3. Add generated files to eslint ignore:

    ```diff title="api/eslint.config.mjs"
    scripts: {
    -  ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts"],
    +  ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "src/**/generated/**"],
    }
    ```

4. Add generated files to .gitignore:

    ```diff title="api/.gitignore"
    + # API generator
    + src/**/generated
    ```

5. And finally delete generated files from git:

    ```sh
    git rm -r --cached api/src/*/generated
    ```

### Brevo module

If your project uses the COMET brevo module for newsletter integration, check out the [brevo module migration guide](/docs/features-modules/brevo-module/migration-guide/migration-from-brevo-v3-to-v8#api) for necessary steps.

### Fix linting errors

#### EsLint

1. `cd api`
2. `npm run lint:eslint -- --fix`
3. Commit with `--no-verify`
4. Manually fix all remaining errors
5. Commit with `--no-verify`

#### Type errors

1. `npm run lint:tsc`
2. Fix all occurring errors
3. Commit with `--no-verify`

#### Overall lint

1. `npm run lint`
2. Fix all occurring errors
3. Commit **without** `--no-verify`

### Fix runtime errors

1. Start docker with `dpm start docker`
2. Start the api with `dpm start api`
3. Check the logs with `dpm logs api`
4. Fix occurring errors
5. Once the API runs without problems: Commit **without** `--no-verify`

## Admin

### 🤖 Upgrade peer dependencies

The following upgrade script will update peer dependency versions and make some minor changes in the code.

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/admin/before-install
```

:::

<details>

<summary>Updates handled by this batch upgrade script</summary>

#### ✅ React

The React dependency has been bumped to v18.

<details>

 <summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/admin/before-install/update-react-dependencies.ts
```

:::

```diff title=admin/package.json
{
    "dependencies": {
-       "react": "^17.0.2",
-       "react-dom": "^17.0.2",
+       "react": "^18.3.1",
+       "react-dom": "^18.3.1"
    },
    "devDependencies": {
-       "@types/react": "^17.0.83",
-       "@types/react-dom": "^17.0.26",
+       "@types/react": "^18.3.18",
+       "@types/react-dom": "^18.3.5"
    }
}
```

</details>

#### ✅ MUI

The MUI dependencies (`@mui/material`, `@mui/system`, `@mui/utils`, `@mui/icons-material`, `@mui/lab`) were bumped to v7.

<details>

 <summary>Handled by @comet/upgrade</summary>

:::note Handled by

     ```sh
     npx @comet/upgrade@latest v8/admin/before-install/update-mui-dependencies.ts
     ```

:::

```diff
-       "@mui/icons-material": "^5.0.0",
-       "@mui/lab": "^5.0.0-alpha.76",
-       "@mui/material": "^5.0.0",
-       "@mui/system": "^5.0.0",
-       "@mui/utils": "^5.0.0",
+       "@mui/icons-material": "^7.0.0",
+       "@mui/lab": "^7.0.0-beta.9",
+       "@mui/material": "^7.0.0",
+       "@mui/system": "^7.0.0",
+       "@mui/utils": "^7.0.0",
```

</details>

#### ✅ MUI X (DataGrid)

The MUI dependencies (`@mui/x-data-grid`, `@mui/x-data-grid-pro`) were bumped to v7.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/admin/before-install/update-mui-x-dependencies.ts
```

:::

In `package.json` update the version of the MUI X packages to `^7.22.3`.

```diff
- "@mui/x-data-grid": "^5.x.x",
- "@mui/x-data-grid-pro": "^5.x.x",
- "@mui/x-data-grid-premium": "^5.x.x",

+ "@mui/x-data-grid": "^7.22.3",
+ "@mui/x-data-grid-pro": "^7.22.3",
+ "@mui/x-data-grid-premium": "^7.22.3",
```

</details>

#### ✅ Vite / SWC

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/admin/before-install/update-swc-dependencies.ts
```

:::

```diff
-        "@swc/plugin-emotion": "^3.0.13",
-        "@vitejs/plugin-react-swc": "^3.7.2",
+        "@swc/plugin-emotion": "^8.7.2",
+        "@vitejs/plugin-react-swc": "^3.8.0",
```

</details>

#### ✅ Remove `@comet/blocks-admin`

The `@comet/blocks-admin` package has been merged into the `@comet/cms-admin` package.

<details>

<summary>Handled by @comet/upgrade</summary>

Remove the package:

:::note Handled by

```sh
npx @comet/upgrade@latest v8/admin/before-install/remove-blocks-packages-admin.ts
```

:::

```diff title="admin/package.json"
- "@comet/blocks-admin": "^7.x.x",
```

</details>

#### ✅ Remove `@comet/admin-theme`

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/admin/before-install/remove-admin-theme-package.ts
```

:::

</details>

#### ✅ Remove `@comet/admin-react-select`

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/admin/before-install/remove-comet-admin-react-select-dependency.ts
```

:::

```diff
- "@comet/admin-react-select": "^7.x.x",
```

</details>

#### ✅ GraphQL

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/admin/before-install/update-graphql-admin.ts
```

:::

```diff title=admin/package.json
{
    "dependencies": {
-       "graphql": "^15.0.0",
+       "graphql": "^16.10.0",
    },
}
```

</details>

#### ✅ Remove ignore-restricted-imports comments

Removes the comments we added in [step 4](#step-4-update-eslint-and-prettier-pr-4).

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/admin/before-install/remove-v8-eslint-disable-comments-admin.ts
```

:::

```diff
-// TODO v8: remove eslint-disable-next-line
-// eslint-disable-next-line no-restricted-imports
```

</details>

#### Use MUI pickers for `DataGrid` Date / DateTime filters

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/admin/before-install/use-mui-date-picker-in-grid.ts
```

:::

This update improves the UX of date filtering by replacing the current date picker solution with MUI's `DatePicker`.

It **requires installation of new dependencies** and setup of `LocalizationProvider` in your app.

**Migration steps:**

- **Install dependencies:**
  Add the following dependencies to your `package.json`:

```diff
    "dependencies": {
+       "@mui/x-date-pickers": "^7.29.4",
+       "date-fns": "^4.1.0",
    }
```

Update your application root to include `LocalizationProvider from @mui/x-date-pickers:

```diff
+    import { LocalizationProvider } from "@mui/x-date-pickers";
+    import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
+    import { enUS } from "date-fns/locale";

    <IntlProvider locale="en" messages={getMessages()}>
+        <LocalizationProvider adapterLocale={enUS} dateAdapter={AdapterDateFns}>
            <MuiThemeProvider theme={theme}>{/* App Content */}</MuiThemeProvider>
+        </LocalizationProvider>
    </IntlProvider>;
```

If you are already using the `dataGridDateColumn` or `dataGridDateTimeColumn` helpers, the new MUI DatePicker will be used automatically for filtering:

```tsx
import { dataGridDateTimeColumn } from "@comet/admin";

const columns: GridColDef[] = [
    {
        ...dataGridDateTimeColumn,
        field: "createdAt",
        headerName: "Created at",
    },
];
```

</details>

:::info Action required

If your application uses internationalization or a language other than English (US), additional configuration is required. The codemod will add a TODO comment at the relevant location to remind you to configure the appropriate locale for the LocalizationProvider.

:::

</details>

### Add new package @comet/admin-generator

The Admin Generator has been moved into a separate package `@comet/admin-generator`.

```diff title="admin/package.json"
devDependencies: {
+  "@comet/admin-generator": "8.0.0", // replace with the newest v8 version
}
```

### Install

Now it's time to run npm install:

1. Enter the /admin folder: `cd admin`
2. Delete `node_modules` and `package-lock.json` to avoid false positive errors: `rm package-lock.json && rm -rf node_modules`
3. Update `@comet/` packages to the newest v8 version. You can find the latest release on [Github](https://github.com/vivid-planet/comet/releases).
4. `npm install`

    :::warning ‼️ It's likely that the install fails ‼️
    The upgrade scripts only updates the packages we have in the starter.
    You probably have more packages that rely on MUI or React in your project.
    **Update them by hand based on the errors you are getting and rerun the install!**
    :::

5. Once the install passed, commit your changes with `--no-verify`

### Remove `@comet/blocks-admin`

The `@comet/blocks-admin` package has been merged into the `@comet/cms-admin` package.

1. 🤖 Update all imports:

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/admin/after-install/clipboard-helpers.ts
    npx @comet/upgrade@latest v8/admin/after-install/merge-blocks-admin-into-cms-admin.ts
    ```

    :::

     <details>

    To upgrade, perform the following steps:
    1. Update all your imports from `@comet/blocks-admin` to `@comet/cms-admin`
    2. Update imports that have been renamed

     </details>

2. Manually remove usages of removed exports `CannotPasteBlockDialog`, `ClipboardContent`, `useBlockClipboard`, `Collapsible`, `CollapsibleSwitchButtonHeader`, `usePromise`, `DispatchSetStateAction`, `SetStateAction`, and `SetStateFn`

    :::tip

    Use `Dispatch<SetStateAction<T>>` from `react` instead of `DispatchSetStateAction`.

    :::

### 🤖 Remove `@comet/admin-theme`

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/admin/after-install/merge-admin-theme-into-admin.ts
```

:::

<details>

<summary>Handled by @comet/upgrade</summary>

The `@comet/admin-theme` package has been merged into `@comet/admin`, adjust the imports accordingly:

```diff
- import { createCometTheme } from "@comet/admin-theme";
+ import { createCometTheme } from "@comet/admin";

  const theme = createCometTheme();
```

</details>

### Remove `@comet/admin-react-select`

`@comet/admin-react-select` was removed.
It is recommended to use the `AutocompleteField` or the `SelectField` components from `@comet/admin` instead:

```diff
- import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
- <Field name="color" type="text" component={FinalFormReactSelectStaticOptions} fullWidth options={options} />;
+ import { AutocompleteField } from "@comet/admin";
+ <AutocompleteField name="color" label="Color" options={options} fullWidth />;
```

### Add proxy for `/api` and `/dam` URLs

In our deployed setup, all API requests from the admin are routed through the AuthProxy that runs under the admin domain.
To be closer to this setup, we now also do that locally:

```diff title=".env"
 # api
 API_PORT=4000
-API_URL=http://${DEV_DOMAIN:-localhost}${WORKAROUND_DOTENV_ISSUE}:${API_PORT}/api # or similar
+API_URL=$ADMIN_URL/api
```

Also, the API now only returns relative URLs for DAM assets.
You must proxy the `/dam` URLs in your application to the API.
This must be done for local development and production.

#### In development:

Add the proxy to your vite config:

```ts title="admin/vite.config.mts"
//...
server: {
    // ...
    cors: false,
    proxy: process.env.API_URL_INTERNAL
    ? {
         "/api": {
            target: new URL(process.env.API_URL_INTERNAL).origin,
            changeOrigin: true,
            secure: false,
         },
        "/dam": {
            target: process.env.API_URL_INTERNAL,
            changeOrigin: true,
            secure: false,
        },
    }
    : undefined,
    // ...
},
//...
```

or in your webpack config (for old projects):

```ts title="admin/webpack.config.ts"
const config = (env: unknown, argv: Argv): webpack.Configuration => {
    // ...
    return {
        // ...
        devServer: {
            // ...
            proxy: process.env.API_URL_INTERNAL
                ? {
                      "/api": {
                          target: new URL(process.env.API_URL_INTERNAL).origin,
                          changeOrigin: true,
                          secure: false,
                      },
                      "/dam": {
                          target: process.env.API_URL_INTERNAL,
                          changeOrigin: true,
                          secure: false,
                      },
                  }
                : undefined,
        },
    };
};
```

#### In production:

Add the proxy to your admin server:

```diff title="admin/server/package.json"
"dependencies": {
    // ...
+   "http-proxy-middleware": "^3.0.3"
    // ...
},
```

```diff title="admin/server/index.js"
+   const { createProxyMiddleware } = require("http-proxy-middleware");

    // ...

    app.get("/status/health", (req, res) => {
        // ...
    });

+   const proxyMiddleware = createProxyMiddleware({
+       target: process.env.API_URL_INTERNAL + "/dam",
+       changeOrigin: true,
+   });
+   app.use("/dam", proxyMiddleware);

    // ...
```

You might also need to add `API_URL_INTERNAL` to your `values.tpl.yaml` for deployment:

```diff title="deployment/helm/values.tpl.yaml"
admin:
    env:
        ADMIN_URL: "https://$ADMIN_DOMAIN"
        API_URL: "https://$ADMIN_DOMAIN/api"
+       API_URL_INTERNAL: "http://$APP_NAME-$APP_ENV-api:3000/api"
```

### 🤖 Merge providers into `CometConfigProvider`

The separate providers for CMS features (e.g, `DamConfigProvider`) have been merged into a `CometConfigProvider`.

:::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/admin/after-install/comet-config-provider.ts
    ```

    **Note:** This upgrade script is experimental and might not work as expected in your application.
    Review the result carefully.

:::

<details>

<summary>Handled by @comet/upgrade</summary>

Wrap your application with the `CometConfigProvider`:

```tsx title="src/App.tsx"
import { CometConfigProvider } from "@comet/cms-admin";

function App() {
    return (
        <CometConfigProvider
            apiUrl={config.apiUrl}
            graphQLApiUrl={`${config.apiUrl}/graphql`}
            adminUrl={config.adminUrl}
        >
            {/* Application */}
        </CometConfigProvider>
    );
}
```

Move module configs to the new provider:

```diff
 <CometConfigProvider
     apiUrl={config.apiUrl}
     graphQLApiUrl={`${config.apiUrl}/graphql`}
     adminUrl={config.adminUrl}
+    dam={{
+        ...config.dam,
+        scopeParts: ["domain"],
+        contentGeneration: {
+            generateAltText: true,
+            generateImageTitle: true,
+        },
+    }}
 >
     {/* Application */}
 </CometConfigProvider>
```

Remove the old config providers:

```diff
- <DamConfigProvider>
      {/* Application */}
- </DamConfigProvider>
```

Update usages of renamed exports:

- `useSitesConfig()` -> `useSiteConfigs()`
- `useLocale()` -> `useContentLanguage()`
- `useCmsBlockContext()` -> `useBlockContext()`

Remove the `allCategories` prop from `PagesPage`:

```diff
 <PagesPage
     path="/pages/pagetree/main-navigation"
-    allCategories={pageTreeCategories}
     documentTypes={pageTreeDocumentTypes}
     category="MainNavigation"
     renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} />}
 />
```

</details>

:::warning Experimental upgrade script

    This upgrade script is experimental and might not work as expected in your application.
    Review the result carefully.

:::

### Adapt to changes in ContentScopeProvider

#### Use interface augmentation for ContentScope

```diff title="admin/src/App.tsx"
+   import { type ContentScope as BaseContentScope } from "@src/site-configs";

+   declare module "@comet/cms-admin" {
+       // eslint-disable-next-line @typescript-eslint/no-empty-object-type
+       interface ContentScope extends BaseContentScope {}
+   }

    export function App() {
```

The `ContentScopeInterface` export from `@comet/cms-admin` was removed.
Instead, use `ContentScope` directly:

```diff
- import { type ContentScopeInterface } from "@comet/cms-admin";
+ import { type ContentScope } from "@comet/cms-admin";
```

#### Preferably use ContentScopeProvider directly from Comet

Move the scope labels **from admin to the API**, for example:

```diff title="api/src/app.module"
UserPermissionsModule.forRootAsync({
    useFactory: (userService: StaticUsersUserService, accessControlService: AccessControlService) => ({
        availableContentScopes: config.siteConfigs.flatMap((siteConfig) =>
-           siteConfig.scope.languages.map((language) => ({
-               domain: siteConfig.scope.domain,
-               language,
-           })),
+           siteConfig.scope.languages.map((language) => ({
+               scope: {
+                   domain: siteConfig.scope.domain,
+                   language,
+               },
+               label: { domain: siteConfig.name },
+           })),
        ),
        // ...
    }),
    // ...
}),
```

Then you can use the `ContentScopeProvider` from `@comet/cms-admin` directly in your `App.tsx` and delete `admin/src/common/ContentScopeProvider.tsx`:

```diff title="admin/src/App.tsx"
-   import { ContentScopeProvider } from "./common/ContentScopeProvider";
+   import { ContentScopeProvider } from "@comet/cms-admin";
    // Delete `admin/src/common/ContentScopeProvider.tsx`
```

You should also use `useContentScope` from `@comet/cms-admin`.

<details>

<summary>However, if you need custom behavior, you can keep `admin/src/common/ContentScopeProvider.tsx` while skipping above change.</summary>

Make sure to remove the generics:

```diff title="admin/src/common/ContentScopeProvider.tsx"
-   export function useContentScopeConfig(p: ContentScopeConfigProps): void {
-       return useContentScopeConfigLibrary(p);
-   }

-    ContentScopeValues<ContentScope>
+    ContentScopeValues
-    <ContentScopeProviderLibrary<ContentScope>>
+    <ContentScopeProviderLibrary>
```

</details>

### React-related changes

The React dependency has been bumped to v18.

Follow the official [migration guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) to upgrade.

#### Update to client rendering API

```diff title="admin/src/loader.ts"
- ReactDOM.render(createElement(App), rootElement);
+ const root = createRoot(rootElement);
+ root.render(createElement(App));
```

:::info
Otherwise, there's probably not much to do here.
You can also fix potential errors later during the lint step.
:::

:::tip

Use [types-react-codemod](https://github.com/eps1lon/types-react-codemod) to fix potential TypeScript compile errors when upgrading to `@types/react@^18.0.0`.

:::

### MUI-related changes

The MUI dependencies (`@mui/material`, `@mui/system`, `@mui/utils`, `@mui/icons-material`, `@mui/lab`) were bumped to v7.

1. 🤖 Execute MUI codemods to update your code

    :::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/admin/after-install/mui-codemods.ts
    ```

    :::

    :::info
    When executing the codemods, some errors relating to `fragmentTypes.json` or `comet-config.json` can occur.
    You can just ignore them.
    :::

2. Follow the official migration guides to upgrade:
    - [Upgrade to MUI v6](https://mui.com/material-ui/migration/upgrade-to-v6/)
    - [Upgrade to MUI v7](https://mui.com/material-ui/migration/upgrade-to-v7/)
      :::info
      Probably, there's not much to do here.
      You can also fix potential errors later during the lint step.
      :::

### MUI X (DataGrid)-related changes

The MUI dependencies (`@mui/x-data-grid`, `@mui/x-data-grid-pro`) were bumped to v7.

1.  Search for columns with the `type: "dateTime"`. You must add a `valueGetter`:

    ```diff
        <DataGrid
            //other props
            columns=[
            {
                field: "updatedAt",
                type: "dateTime",
    +           valueGetter: (params, row) => row.updatedAt && new Date(row.updatedAt)
            }]
        />
    ```

2.  Search for `valueGetter` and `valueFormatter`

    Change the arguments passed to the functions.
    Previously, arguments were passed as an object. Now, they are passed directly as individual parameters

    ```diff
        <DataGrid
            //other props
            columns=[
            {
                field: "updatedAt",
                type: "dateTime",
    -           valueGetter: ({params, row}) => row.updatedAt && new Date(row.updatedAt)
    +           valueGetter: (params, row) => row.updatedAt && new Date(row.updatedAt)
    -           valueFormatter: ({value}) => (value ? intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }) : ""),
    +           valueFormatter: (value) => (value ? intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }) : ""),
            }]
        />
    ```

3.  A lots of props have been renamed from MUI, for a detailed look, see the official [migration guide v5 -> v6](https://mui.com/x/migration/migration-data-grid-v5) and [migration guide v6 -> v7](https://mui.com/x/migration/migration-data-grid-v6/).

    There is also a codemod from MUI which handles most of the changes:

    :::note Execute the following upgrade script:

        ```sh
        npx @comet/upgrade@latest v8/admin/after-install/mui-x-codemods.ts
        ```

    :::

#### Update usage of `DataGridToolbar`

`DataGridToolbar` has been simplified to a basic wrapper component. Props and features from the standard `Toolbar` component have been removed, along with the `density` prop since density is now controlled by the `DataGrid`.

The new usage simplifies the component structure - children can now be passed directly without needing to wrap them in `ToolbarItem` and `ToolbarActions` components:

```diff
- <DataGridToolbar density="compact">
+ <DataGridToolbar>
-     <ToolbarItem>
          <GridToolbarQuickFilter />
-     </ToolbarItem>
-     <ToolbarItem>
          <GridFilterButton />
-     </ToolbarItem>
-     <ToolbarItem>
          <GridColumnsButton />
-     </ToolbarItem>
      <FillSpace />
-     <ToolbarActions>
          <Button responsive variant="outlined">
              Secondary action
          </Button>
          <Button responsive startIcon={<AddIcon />}>
              Add item
          </Button>
-     </ToolbarActions>
  </DataGridToolbar>
```

#### 🤖 Pass columns instead of apiRef to `muiGridSortToGql` Function

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/admin/after-install/mui-grid-sort-to-gql.ts
```

**Note:** This upgrade script will naively change the second argument of `muiGridSortToGql` function to `columns`, assuming that `columns` is available in the current scope.

:::

<details>

The `muiGridSortToGql` helper now expects the columns instead of the `apiRef`:

```diff
const columns : GridColDef[] = [/* column definitions*/];
const dataGridRemote = useDataGridRemote();
const persistentColumnState = usePersistentColumnState("persistent_column_state");

-  muiGridSortToGql(dataGridRemote.sortModel, persistentColumnState.apiRef);
+  muiGridSortToGql(dataGridRemote.sortModel, columns);
```

</details>

:::warning Naive upgrade script

     This upgrade script will naively change the second argument of `muiGridSortToGql` function to `columns`, assuming that `columns` is available in the current scope.

:::

#### Remove `error` prop from DataGrid

> The error and onError props were removed - the grid no longer catches errors during rendering. To catch errors that happen during rendering use the error boundary. The components.ErrorOverlay slot was also removed.
>
> – [MUI migration guide](https://mui.com/x/migration/migration-data-grid-v5/#removed-props)

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/admin/after-install/mui-data-grid-remove-error-prop.ts
```

**Note:** Error handling must be implemented manually, the upgrade script simply removes all usages of the error prop on DataGrids and adds a TODO: comment.

:::

:::warning Error handling must be implemented manually

     This upgrade script simply removes all usages of the error prop on DataGrids and adds a TODO: comment. Error handling must be implemented manually.

:::

The recommended way to handle errors is to use the `ErrorBoundary` in the parent component and throw errors where the query error happens.

```diff
- const { loading, data, error } = useQuery(/* query parameters */)
- <DataGrid error={error} /* other props */ >

+ const { loading, data, error } = useQuery(/* query parameters */)
+ if (error) {
+     throw error
+ }
+ <DataGrid /* other props */ >
```

#### `useDataGridRemote` Hook - Return Value

The `useDataGridRemote` hook has been changed to match the updated DataGrid props:

```diff
- const { pageSize, page, onPageSizeChange } = useDataGridRemote();
+ const { paginationModel, onPaginationModelChange } = useDataGridRemote();
```

:::warning `rowCount` must be passed

Be aware that you must pass `rowCount` to the DataGrid when using the `useDataGridRemote` hook. Otherwise, the pagination component will show a `NaN` value when used with server-side pagination.

:::

#### i18n for MUI X date picker

In the before-install script, a `LocalizationProvider` was added to `App.tsx`.
A `adapterLocale` is passed to the provider.
If your application uses internationalization or a language other than English (US), make sure to pass the right locale based on the supported languages.

### 🤖 Rename `Menu` and related components to `MainNavigation` in `@comet/admin`

:::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/admin/after-install/rename-menu-components-in-admin.ts
    ```

:::

<details>

<summary>Handled by @comet/upgrade</summary>

To better differentiate between imports from `@comet/admin` and `@mui/material`, the following components and related types have been renamed:

- `Menu` → `MainNavigation`
- `MenuProps` → `MainNavigationProps`
- `MenuClassKey` → `MainNavigationClassKey`
- `MenuItem` → `MainNavigationItem`
- `MenuItemProps` → `MainNavigationItemProps`
- `MenuItemClassKey` → `MainNavigationItemClassKey`
- `MenuCollapsibleItem` → `MainNavigationCollapsibleItem`
- `MenuCollapsibleItemProps` → `MainNavigationCollapsibleItemProps`
- `MenuCollapsibleItemClassKey` → `MainNavigationCollapsibleItemClassKey`
- `IWithMenu` → `WithMainNavigation`
- `withMenu` → `withMainNavigation`
- `MenuItemAnchorLink` → `MainNavigationItemAnchorLink`
- `MenuItemAnchorLinkProps` → `MainNavigationItemAnchorLinkProps`
- `MenuItemGroup` → `MainNavigationItemGroup`
- `MenuItemGroupClassKey` → `MainNavigationItemGroupClassKey`
- `MenuItemGroupProps` → `MainNavigationItemGroupProps`
- `MenuItemRouterLink` → `MainNavigationItemRouterLink`
- `MenuItemRouterLinkProps` → `MainNavigationItemRouterLinkProps`

The `MenuContext` has been removed, use the new `useMainNavigation` hook instead.

</details>

### Dialog-related changes

#### 🤖 Import `Dialog` from `@comet/admin` package

:::warning
`Dialog` now supports a `title` prop that automatically adds a `DialogTitle` component.
So if you have a `Dialog` with a `DialogTitle` as a child, you should remove the `DialogTitle` and pass its children as `title` prop to `Dialog`.
:::

:::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/admin/after-install/update-import-of-dialog.ts
    ```

:::

<details>

```diff
- import { Dialog } from "@mui/material";
+ import { Dialog } from "@comet/admin";
```

</details>

#### 🤖 Add `DialogContent` to `EditDialog`

:::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/admin/after-install/add-dialog-content-to-edit-dialog.ts
    ```

:::

<details>

The `DialogContent` inside `EditDialog` has been removed.
To maintain the existing styling of `EditDialog`, such as for forms and text, manually wrap the content with `DialogContent` to ensure proper spacing.
For grids or other elements that already handle their own spacing (e.g., `DataGrid`), adding `DialogContent` is not necessary.

```diff
    <EditDialog>
    //...
+       <DialogContent>
+           //...
+       </DialogContent>
    // ...
    </EditDialog>
```

</details>

### Tooltip-related Changes

#### 🤖 Import `Tooltip` from `@comet/admin` package

:::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/admin/after-install/tooltip-1-update-import.ts
    ```

:::

<details>

```diff
- import { Tooltip } from "@mui/material";
+ import { Tooltip } from "@comet/admin";
```

</details>

#### 🤖 Remove `trigger` prop from `Tooltip`

:::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/admin/after-install/tooltip-2-remove-trigger-prop.ts
    ```

:::

<details>

The `trigger` prop has been removed. The combined `hover`/`focus` trigger is now the only supported behavior.

Example:

```diff
<Tooltip
- trigger="hover"
></Tooltip>
```

</details>

### 🤖 Import `Button` from `@comet/admin` package

:::note Execute the following upgrade script:

    ```sh
    npx @comet/upgrade@latest v8/admin/after-install/replace-mui-button-with-comet-admin-button.ts
    ```

:::

<details>

```diff
- import { Button } from "@mui/material";
+ import { Button } from "@comet/admin";
```

</details>

### Choose correct `Button` variant

The `Button` from `@comet/admin` only has a smaller set of variants defined by UX:

```ts
type Variant =
    | "primary"
    | "secondary"
    | "outlined"
    | "destructive"
    | "success"
    | "textLight"
    | "textDark";
```

You must choose visually, which variant is correct for you.
Probably the two most common cases are:

```diff
- <Button color="primary" variant="contained" />
+ <Button />
```

```diff
- <Button variant="text" />
+ <Button variant="textDark" />
```

### `FinalFormToggleButtonGroup` deprecated

`FinalFormToggleButtonGroup` has been deprecated and a new component `ToggleButtonGroupField` got introduced that has the Final Form Field wrapped around it.

```diff
- import { FinalFormToggleButtonGroup } from "@comet/cms-admin";
+ import { ToggleGroupButtonField } from "@comet/admin";

...
+ FormValueType = "value1" | "value2";

- <Field
-   name="formValue"
-   label={"Field Label"}
-   component={FinalFormToggleButtonGroup}
-   options={[
-       { value: "value1", icon: <Info /> },
-       { value: "value2", icon: <Error /> },
-   ]}
-   optionsPerRow={2}
- />
+ <ToggleGroupButtonField<FormValueType>
+    name="formValue"
+    label={"Field Label"}
+    options={[
+        { value: "value1", label: <Info /> },
+        { value: "value2", label: <Error /> },
+    ]}
+    optionsPerRow={2}
+    />
```

The `FinalFormToggleButtonGroup` component is still available, but moved from `@comet/cms-admin` to `@comet/admin` package. Furthermore, the value `icon` in the `options` prop has been renamed to `label`.

```diff
- <Field
-   name="formValue"
-   label={"Field Label"}
-   component={FinalFormToggleButtonGroup}
-   options={[
-       { value: "value1", icon: <Info /> },
+       { value: "value1", label: <Info /> },
-       { value: "value2", icon: <Info /> },
+       { value: "value2", label: <Info /> },
-   ]}
-   optionsPerRow={2}
- />
```

### Add the `LocalDate` scalar to the GraphQL Codegen config

```diff title="admin/codegen.ts"
scalars: rootBlocks.reduce(
    (scalars, rootBlock) => ({ ...scalars, [rootBlock]: rootBlock }),
+   { LocalDate: "string" }
)
```

### `DashboardWidgetRoot` / `LatestContentUpdates` no longer handles Grid layout

The `DashboardWidgetRoot` / `LatestContentUpdates` component no longer wraps its children in a `<Grid>` component. This means that layout and sizing must now be handled by the parent component.

**Migration steps `DashboardWidgetRoot:**

- **Before:**  
  `DashboardWidgetRoot` automatically wrapped its content in a grid item, e.g.

    ```tsx
    <DashboardWidgetRoot>{/* widget content */}</DashboardWidgetRoot>
    ```

- **After:**  
  You must now wrap `DashboardWidgetRoot` in a `<Grid item>` yourself:
    ```tsx
    <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardWidgetRoot>{/* widget content */}</DashboardWidgetRoot>
    </Grid>
    ```

**Migration steps `LatestContentUpdates`:**

- **Before:**

    ```tsx
    <LatestContentUpdates />
    ```

- **After:**
    ```tsx
    <Grid size={{ xs: 12, lg: 6 }}>
        <LatestContentUpdates />
    </Grid>
    ```

**Action required:**  
Review all usages of `DashboardWidgetRoot` / `LatestContentUpdates` in your dashboards and ensure they are wrapped in a `<Grid>` (or another layout component as appropriate). This gives you full control over widget placement and sizing.

### Move redirects `scopeParts` to `CometConfigProvider`.

Previously `scopeParts` were passed to `createRedirectsPage`. Those need to be removed:

```diff
const RedirectsPage = createRedirectsPage({
    customTargets: { news: NewsLinkBlock },
-   scopeParts: ["domain"],
});
```

Instead add the redirect config to your `CometConfigProvider`:

```diff
 <CometConfigProvider
    apiUrl={config.apiUrl}
    graphQLApiUrl={`${config.apiUrl}/graphql`}
    adminUrl={config.adminUrl}
    dam={{
        ...config.dam,
        scopeParts: ["domain"],
        contentGeneration: {
            generateAltText: true,
            generateImageTitle: true,
        },
    }}
+   redirects={{
+       scopeParts: ["domain"]
+   }}
 >
     {/* Application */}
 </CometConfigProvider>
```

### Rework `createRedirectsPage` usage to accept `linkBlock` instead of `customTargets`.

Previously, `customTargets` were passed directly:

```ts
const RedirectsPage = createRedirectsPage({
    customTargets: { news: NewsLinkBlock },
});
```

Now, you should first create the `RedirectsLinkBlock` and then provide it to `createRedirectsPage`:

```ts
export const RedirectsLinkBlock = createRedirectsLinkBlock({
    news: NewsLinkBlock,
});

export const RedirectsPage = createRedirectsPage({
    linkBlock: RedirectsLinkBlock,
});
```

This change was made because `RedirectsLinkBlock` is also needed by `RedirectDependency`, and can therefore be reused.

### Brevo module

If your project uses the COMET brevo module for newsletter integration, check out the [brevo module migration guide](/docs/features-modules/brevo-module/migration-guide/migration-from-brevo-v3-to-v8#admin) for necessary steps.

### Fix linting errors

#### EsLint

1. `cd admin`
2. `npm run lint:eslint -- --fix`
3. Commit with `--no-verify`
4. Manually fix all remaining errors
5. Commit with `--no-verify`

#### Type errors

1. `npm run lint:tsc`
2. Fix all occurring errors
3. Commit with `--no-verify`

#### Overall lint

1. `npm run lint`
2. Fix all occurring errors
3. Commit **without** `--no-verify`

### Fix runtime errors

1. Start the admin with `dpm start admin`
2. Check the logs with `dpm logs admin`
3. Fix occurring errors
4. Once the admin runs without problems: Commit **without** `--no-verify`

## Site

### Switch from `@comet/cms-site` to `@comet/site-nextjs`

Ignore this if you already did it beforehand in [step 3](#step-3-switch-from-cometcms-site-to-cometsite-nextjs-pr-3).
Otherwise, go back and do it now.

### 🤖 Upgrade peer dependencies

The following upgrade script will update peer dependency versions.

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/site/before-install
```

:::

<details>

<summary>Updates handled by this batch upgrade script</summary>

#### ✅ GraphQL

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by

```sh
npx @comet/upgrade@latest v8/site/before-install/update-graphql-site.ts
```

:::

```diff title=site/package.json
{
    "dependencies": {
-       "graphql": "^15.0.0",
+       "graphql": "^16.10.0",
    },
}
```

</details>

</details>

### Install

Now it's time to run npm install:

1. Enter the /site folder: `cd site`
2. Delete `node_modules` and `package-lock.json` to avoid false positive errors: `rm package-lock.json && rm -rf node_modules`
3. Update `@comet/` packages to the newest v8 version. You can find the latest release on [Github](https://github.com/vivid-planet/comet/releases).
4. `npm install`
5. Once the install passed, commit your changes with `--no-verify`

### 🤖 Remove `graphQLFetch` from `sitePreviewRoute` calls

:::note Execute the following upgrade script:

```sh
npx @comet/upgrade@latest v8/site/after-install/remove-graphql-client-from-site-preview-handlers.ts
```

:::

<details>

```diff title="site/src/app/site-preview/route.ts"
-    return sitePreviewRoute(request, createGraphQLFetch());
+    return sitePreviewRoute(request);
```

</details>

### Remove `x-relative-dam-urls` header from `graphQLClient`

```diff title="site/src/util/graphQLClient.ts"
// ...
return createGraphQLFetchLibrary(
    createFetchWithDefaults(fetch, {
        // ...
        headers: {
-           "x-relative-dam-urls": "1",
            // ...
        },
    }),
    `${process.env.API_URL_INTERNAL}/graphql`,
);
```

### Add the `LocalDate` scalar to the GraphQL Codegen config

```diff title="site/codegen.ts"
scalars: rootBlocks.reduce(
    (scalars, rootBlock) => ({ ...scalars, [rootBlock]: rootBlock }),
+   { LocalDate: "string" }
)
```

### Brevo module

If your project uses the COMET brevo module for newsletter integration, check out the [brevo module migration guide](/docs/features-modules/brevo-module/migration-guide/migration-from-brevo-v3-to-v8#site) for necessary steps.

### Fix linting errors

#### EsLint

1. `cd site`
2. `npm run lint:eslint -- --fix`
3. Commit with `--no-verify`
4. Manually fix all remaining errors
5. Commit with `--no-verify`

#### Type errors

1. `npm run lint:tsc`
2. Fix all occurring errors
3. Commit with `--no-verify`

#### Overall lint

1. `npm run lint`
2. Fix all occurring errors
3. Commit **without** `--no-verify`

### Fix runtime errors

1. Start the site with `dpm start site`
2. Check the logs with `dpm logs site`
3. Fix occurring errors
4. Execute a local prod build: `./build-and-run-site.sh` (if you don't have the script yet, get it from the [COMET Starter](https://github.com/vivid-planet/comet-starter/blob/main/build-and-run-site.sh))
5. Once the site runs without problems: Commit **without** `--no-verify`
