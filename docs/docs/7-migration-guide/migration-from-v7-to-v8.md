---
title: Migrating from v7 to v8
sidebar_position: -8
---

# Migrating from v7 to v8

:::warning Use the upgrade scripts

Start by executing the upgrade script in the root of your project:

```sh
npx @comet/upgrade@latest v8
```

That handles most of the necessary changes.

:::

The following sections go over all necessary changes.
All changes handled by the upgrade script are hidden in closed accordions.
Refer to the hidden content if you face issues with the upgrade scripts.

:::info

You can re-execute individual upgrade scripts if needed: `npx @comet/upgrade@latest v8/[upgrade-script-name].ts`

:::

## General

### ✅ Upgrade Node to v22

<details>

<summary>Handled by @comet/upgrade</summary>

#### In development:

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/replace-node-with-v22-locally.ts
```

:::

```diff title=.nvmrc
- 20
+ 22
```

```diff title=package.json
- "@types/node": "^20.0.0",
+ "@types/node": "^22.0.0",
```

#### In pipeline and deployment:

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/replace-node-with-v22-in-gitlab-ci-files.ts
```

:::

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

## API

### ✅ Upgrade peer dependencies

#### NestJS

1.  Upgrade all your dependencies to support NestJS v11

    <details>

    <summary>Handled by @comet/upgrade</summary>

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/update-nest-dependencies.ts
    ```

    :::

    ```diff title=api/package.json
    {
        "dependencies": {
    +       "@apollo/server": "^4.0.0",
    -       "@nestjs/apollo": "^10.0.0",
    -       "@nestjs/common": "^9.0.0",
    -       "@nestjs/config": "^2.0.0",
    -       "@nestjs/core": "^9.0.0",
    -       "@nestjs/graphql": "^10.0.0",
    -       "@nestjs/passport": "^9.0.0",
    -       "@nestjs/platform-express": "^9.0.0",
    +       "@nestjs/apollo": "^13.0.0",
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

2.  Update the custom `formatError` function to hide GraphQL field suggestions

    <details>

    <summary>Handled by @comet/upgrade</summary>

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/update-graphql-format-error.ts
    ```

    :::

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

3.  You may need to update some of your routes to support Express v5.
    See the [migration guide](https://docs.nestjs.com/migration-guide#express-v5) for more information.

#### ✅ Add NestJS peer dependencies

Peer dependencies defined by NestJS have been added as peer dependencies to `@comet/cms-api`.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/nest-peer-dependencies.ts
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

#### MikroORM

1.  Upgrade all your dependencies:

    <details>

    <summary>Handled by @comet/upgrade</summary>

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/update-mikro-orm-dependencies.ts
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

2.  Follow the official [migration guide](https://mikro-orm.io/docs/upgrading-v5-to-v6) to upgrade.

    :::note Partially handled by upgrade scripts

    We provide upgrade scripts for basic migrations.
    Please note that these scripts might not cover all necessary migrations.

    <details>

    <summary>Changes handled by @comet/upgrade</summary>

    Remove generic from `BaseEntity`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-base-entity-generic.ts
    ```

    Rename `customType` to `type`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-custom-type.ts
    ```

    Rename `onDelete` to `deleteRule`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-delete-rule.ts
    ```

    Add a `mikro-orm` script with a dotenv call to `package.json`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-dotenv.ts
    ```

    Change all imports from `@mikro-orm/core` to `@mikro-orm/postgresql`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-imports.ts
    ```

    Wrap config in `defineConfig`:

    ```sh
    npx @comet/upgrade v8/mikro-orm-ormconfig.ts
    ```

    </details>

    :::

#### ✅ class-validator

The class-validator peer dependency has been bumped to v0.14.0.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/update-class-validator.ts
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

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/update-sentry.ts
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

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/update-kubernetes-client-node.ts
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

### ✅ Add new package @comet/api-generator

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/api-generator-dev-dependencies.ts
    ```

:::

The API Generator has been moved into a separate package `@comet/api-generator`.

```diff title="api/package.json"
devDependencies: {
+  "@comet/api-generator": "^8.0.0",
}
```

</details>

### API Generator - Removed Special `status` Field Behavior

Previously, if entities specified a `status` enum, it was automatically added to list queries arguments with a default value.

This special handling has been removed. The `status` field now behaves like a normal enum. Filtering by `status` can be
done with the normal filtering mechanism.

### API Generator - Don't commit generated files [optional]

The improved performance of API Generator doesn't make it necessary anymore to add generated files to git. You can remove previously generated files and generate them on demand:

run api-generator in prebuild:

```diff title="api/package.json"
scripts: {
-  "prebuild": "rimraf dist",
+  "prebuild": "rimraf dist && npm run api-generator",
}
```

lint script can be removed:

```diff title="api/package.json"
scripts: {
-  "lint:generated-files-not-modified": "npm run api-generator && git diff --exit-code HEAD -- src/**/generated",
}
```

Add generated files to eslint ignore:

```diff title="api/eslint.config.mjs"
scripts: {
-  ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts"],
+  ignores: ["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "src/**/generated/**"],
}
```

Add generated files to .gitignore:

```diff title="api/.gitignore"
scripts: {
+  src/**/generated
}
```

And finally delete generated files from git:

```sh
git rm -r api/src/*/generated
```

### ✅ Remove `@comet/blocks-api`

The `@comet/blocks-api` package has been merged into the `@comet/cms-api` package.

<details>

<summary>Handled by @comet/upgrade</summary>

To upgrade, perform the following steps:

1.  Remove the package:

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/remove-blocks-packages.ts
    ```

    :::

    ```diff title="api/package.json"
    - "@comet/blocks-api": "^7.x.x",
    ```

2.  Update all your imports from `@comet/blocks-api` to `@comet/cms-api`

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/merge-blocks-api-into-cms-api.ts
    ```

    :::

3.  Update imports that have been renamed

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/merge-blocks-api-into-cms-api.ts
    ```

    :::

4.  Remove usages of removed export `getFieldKeys` (probably none)

</details>

### Replace nestjs-console with nest-commander

The [nestjs-console](https://github.com/Pop-Code/nestjs-console) package isn't actively maintained anymore.
We therefore replace it with [nest-command](https://nest-commander.jaymcdoniel.dev/).

The upgrade script will remove the `nestjs-console` package and install `nest-commander` and `@types/inquirer`.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/replace-nestjs-console-with-nest-commander.ts
```

:::

1. Uninstall `nestjs-console`
2. Install `nest-commander` and `@types/inquirer`
 </details>

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

2. Update your commands to the new `nest-commander` syntax

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

The passport dependencies were removed by the upgrade script.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/remove-passport.ts
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

Following steps must be done manually:

Rename the `strategy`-factories and wrap them in `...createAuthGuardProviders()`:

```diff title=api/src/auth/auth.module.ts
-   createStaticCredentialsBasicStrategy({ ... }),
-   createAuthProxyJwtStrategy({ ... }),
-   createStaticCredentialsBasicStrategy({ ... }),
+   ...createAuthGuardProviders(
+       createBasicAuthService({ ... }),
+       createJwtAuthService({ ... }),
+       createSitePreviewAuthService({ ... }),
+       createStaticUserAuthService({ ... }),
+   ),
```

:::note Configuration changes
The configuration of the AuthServices have changed slightly compared to the strategies, however they remain similar. Consulting the code completion should help to adapt.
:::

Replace `createAuthResolver` with the class name:

```diff title=api/src/auth/auth.module.ts
-   useClass: createCometAuthGuard([...]),
+   useClass: CometAuthGuard,
```

:::note Passport not supported anymore
`CometAuthGuard` does not support Passport strategies anymore. Consider rewriting or wrapping into `AuthServiceInterface`. However, you still can use passport strategies in conjunction with the provided `AuthGuard` from `@nestjs/passport`.
:::

Import `JwtModule` from `@nestjs/jwt`:

```diff title=api/src/auth/auth.module.ts
    exports: [UserService, AccessControlService],
+   imports: [JwtModule],
```

### Add `ImgproxyModule` and change config of `BlobStorageModule` and `DamModule`

The `FileUploadsModule` has been completely separated from the `DamModule` and now works independently.
Some structural changes were necessary to achieve this.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/src/v8/update-dam-configuration.ts
```

:::

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

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/move-maxSrcResolution-in-comet-config.ts
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

### ✅ Change s3 blob-storage config structure

It's now possible to configure the S3-client completely.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/update-s3-config.ts
```

:::

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

## Admin

### Upgrade peer dependencies

#### React

The React dependency has been bumped to v18.

1. Upgrade all your dependencies

    <details>

     <summary>Handled by @comet/upgrade</summary>

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/update-react-dependencies.ts
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

2. Follow the official [migration guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) to upgrade.

    :::tip

    Use [types-react-codemod](https://github.com/eps1lon/types-react-codemod) to fix potential TypeScript compile errors when upgrading to `@types/react@^18.0.0`.

    :::

#### MUI

The MUI dependencies (`@mui/material`, `@mui/system`, `@mui/utils`, `@mui/icons-material`, `@mui/lab`) were bumped to v7.

1.  Upgrade your MUI dependencies

     <details>

     <summary>Handled by @comet/upgrade</summary>

    :::note Handled by following upgrade script

         ```sh
         npx @comet/upgrade v8/update-mui-dependencies.ts
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

2.  Execute MUI codemods to update your code

     <details>

     <summary>Handled by @comet/upgrade</summary>

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/mui-codemods.ts
    ```

    :::
    </details>

3.  Follow the official migration guides to upgrade:
    - [Upgrade to MUI v6](https://mui.com/material-ui/migration/upgrade-to-v6/)
    - [Upgrade to MUI v7](https://mui.com/material-ui/migration/upgrade-to-v7/)

#### MUI X (DataGrid)

The MUI dependencies (`@mui/x-data-grid`, `@mui/x-data-grid-pro`) were bumped to v7.

<details>

<summary>Handled by @comet/upgrade</summary>

In `package.json` update the version of the MUI X packages to `^7.22.3`.

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/update-mui-x-dependencies.ts
```

:::

```diff
- "@mui/x-data-grid": "^5.x.x",
- "@mui/x-data-grid-pro": "^5.x.x",
- "@mui/x-data-grid-premium": "^5.x.x",

+ "@mui/x-data-grid": "^7.22.3",
+ "@mui/x-data-grid-pro": "^7.22.3",
+ "@mui/x-data-grid-premium": "^7.22.3",
```

A lots of props have been renamed from MUI, for a detailed look, see the official [migration guide v5 -> v6](https://mui.com/x/migration/migration-data-grid-v5) and [migration guide v6 -> v7](https://mui.com/x/migration/migration-data-grid-v6/). There is also a codemod from MUI which handles most of the changes:

:::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/mui-x-codemods.ts
    ```

:::

</details>

:::warning

Be aware if you have a date in the data grid, you will need to add a `valueGetter`

:::

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

Also, be aware if you have a `valueGetter` or `valueFormatter` in the data grid, you will need to change the arguments passing to the functions. Previously, arguments were passed as an object. Now, they are passed directly as individual parameters

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

#### ✅ Vite / SWC

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/update-swc-dependencies.ts
```

:::

```diff
-        "@swc/plugin-emotion": "^3.0.13",
-        "@vitejs/plugin-react-swc": "^3.7.2",
+        "@swc/plugin-emotion": "^8.7.2",
+        "@vitejs/plugin-react-swc": "^3.8.0",
```

</details>

### ✅ Add new package @comet/admin-generator

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/admin-generator-dev-dependencies.ts
    ```

:::

The Admin Generator has been moved into a separate package `@comet/admin-generator`.

```diff title="admin/package.json"
devDependencies: {
+  "@comet/admin-generator": "^8.0.0",
}
```

</details>

### ✅ Remove `@comet/blocks-admin`

The `@comet/blocks-admin` package has been merged into the `@comet/cms-admin` package.

<details>

<summary>Handled by @comet/upgrade</summary>

To upgrade, perform the following steps:

1.  Remove the package:

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/remove-blocks-packages.ts
    ```

    :::

    ```diff title="admin/package.json"
    - "@comet/blocks-admin": "^7.x.x",
    ```

2.  Update all your imports from `@comet/blocks-admin` to `@comet/cms-admin`

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/merge-blocks-admin-into-cms-admin.ts
    ```

    :::

3.  Update imports that have been renamed

    :::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/merge-blocks-admin-into-cms-admin.ts
    ```

    :::

</details>

Manually remove usages of removed exports `CannotPasteBlockDialog`, `ClipboardContent`, `useBlockClipboard`, `Collapsible`, `CollapsibleSwitchButtonHeader`, `usePromise`, `DispatchSetStateAction`, `SetStateAction`, and `SetStateFn`

:::tip

Use `Dispatch<SetStateAction<T>>` from `react` instead of `DispatchSetStateAction`.

:::

### ✅ Remove `@comet/admin-theme`

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/merge-admin-theme-into-admin.ts
npx @comet/upgrade v8/remove-admin-theme-package.ts
```

:::

The `@comet/admin-theme` package has been merged into `@comet/admin`, adjust the imports accordingly:

```diff
- import { createCometTheme } from "@comet/admin-theme";
+ import { createCometTheme } from "@comet/admin";

  const theme = createCometTheme();
```

</details>

### ✅ Remove `@comet/admin-react-select`

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/remove-comet-admin-react-select-dependency.ts
```

:::

```diff
- "@comet/admin-react-select": "^7.x.x",
```

</details>

It is recommended to use the `AutocompleteField` or the `SelectField` components from `@comet/admin` instead:

```diff
- import { FinalFormReactSelectStaticOptions } from "@comet/admin-react-select";
- <Field name="color" type="text" component={FinalFormReactSelectStaticOptions} fullWidth options={options} />;
+ import { AutocompleteField } from "@comet/admin";
+ <AutocompleteField name="color" label="Color" options={options} fullWidth />;
```

### Change type of the `values` prop of `ContentScopeProvider`

The `ContentScopeProvider` now expects a different structure for the `values` prop.

**Before:**

```ts
const values: ContentScopeValues = [
    {
        domain: { label: "Main", value: "main" },
        language: { label: "English", value: "en" },
    },
    {
        domain: { label: "Main", value: "main" },
        language: { label: "German", value: "de" },
    },
    {
        domain: { label: "Secondary", value: "secondary" },
        language: { label: "English", value: "en" },
    },
];
```

**Now:**

```ts
const values: ContentScopeValues = [
    {
        scope: { domain: "main", language: "en" },
        label: { domain: "Main", language: "English" },
    },
    {
        scope: { domain: "main", language: "de" },
        label: { domain: "Main", language: "German" },
    },
    {
        scope: { domain: "secondary", language: "en" },
        label: { domain: "Secondary", language: "English" },
    },
];
```

The following changes are necessary:

```diff title="admin/src/common/ContentScopeProvider.tsx"
import {
+   type ContentScope,
    // ...
} from "@comet/cms-admin";
+ import { type ContentScope as BaseContentScope } from "@src/site-configs";

+ declare module "@comet/cms-admin" {
+     // eslint-disable-next-line @typescript-eslint/no-empty-object-type
+     interface ContentScope extends BaseContentScope {}
+ }

- export function useContentScope(): UseContentScopeApi<ContentScope> {
-    return useContentScopeLibrary<ContentScope>();
- }

// ...

export const ContentScopeProvider = ({ children }: Pick<ContentScopeProviderProps, "children">) => {

    // ...

-    const values: ContentScopeValues<ContentScope> = userContentScopes.map((contentScope) => ({
-        domain: { value: contentScope.domain },
-        language: { value: contentScope.language, label: contentScope.language.toUpperCase() },
+    const values: ContentScopeValues = userContentScopes.map((contentScope) => ({
+        scope: contentScope,
+        label: { language: contentScope.language.toUpperCase() },
  }));

  if (user.allowedContentScopes.length === 0) {
-        throw new Error("User does not have access to any scopes.");
+        return (
+            <>
+                Error: user does not have access to any scopes.
+                {user.impersonated && <StopImpersonationButton />}
+            </>
+        );
  }

  return (
-        <ContentScopeProviderLibrary<ContentScope> values={values} defaultValue={userContentScopes[0]}>
+        <ContentScopeProviderLibrary values={values} defaultValue={userContentScopes[0]}>
             {children}
         </ContentScopeProviderLibrary>
  );
}
```

### ✅ Merge providers into `CometConfigProvider`

The separate providers for CMS features (e.g, `DamConfigProvider`) have been merged into a `CometConfigProvider`.

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/comet-config-provider.ts
    ```

    **Note:** This upgrade script is experimental and might not work as expected in your application.
    Review the result carefully.

:::

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

### Add proxy for `/dam` URLs

The API now only returns relative URLs for DAM assets.
You must proxy the `/dam` URLs in your application to the API.
This must be done for local development and production.

#### In development:

Add the proxy to your vite config:

```ts title=admin/vite.config.mts
//...
server: {
    // ...
    proxy: process.env.API_URL_INTERNAL
    ? {
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

#### In production:

Add the proxy to your admin server:

```diff title=admin/package.json
"dependencies": {
    // ...
+   "http-proxy-middleware": "^3.0.3"
    // ...
},
```

```diff title=admin/server/index.js
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

```diff title=deployment/helm/values.tpl.yaml
admin:
    env:
        ADMIN_URL: "https://$ADMIN_DOMAIN"
        API_URL: "https://$ADMIN_DOMAIN/api"
+       API_URL_INTERNAL: "http://$APP_NAME-$APP_ENV-api:3000/api"
```

### ✅ Rename `Menu` and related components to `MainNavigation` in `@comet/admin`

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/rename-menu-components-in-admin.ts
    ```

:::

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

### DataGrid-related changes

### Update usage of `DataGridToolbar`

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

#### ✅ Pass columns instead of apiRef to `muiGridSortToGql` Function

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/mui-grid-sort-to-gql.ts
```

**Note:** This upgrade script will naively change the second argument of `muiGridSortToGql` function to `columns`, assuming that `columns` is available in the current scope.

:::

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

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/mui-data-grid-remove-error-prop.ts
```

**Note:** Error handling must be implemented manually, the upgrade script simply removes all usages of the error prop on DataGrids and adds a TODO: comment.

:::

</details>

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

#### ✅ `useDataGridRemote` Hook - Return Value

The `useDataGridRemote` hook has been changed to match the updated DataGrid props:

```diff
- const { pageSize, page, onPageSizeChange } = useDataGridRemote();
+ const { paginationModel, onPaginationModelChange } = useDataGridRemote();
```

:::warning `rowCount` must be passed

Be aware that you must pass `rowCount` to the DataGrid when using the `useDataGridRemote` hook. Otherwise, the pagination component will show a `NaN` value when used with server-side pagination.

:::

### ✅ Dialog-related changes

#### ✅ Import `Dialog` from `@comet/admin` package

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/update-import-of-dialog.ts
    ```

:::

```diff
- import { Dialog } from "@mui/material";
+ import { Dialog } from "@comet/admin";
```

</details>

#### ✅ Add `DialogContent` to `EditDialog`

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/add-dialog-content-to-edit-dialog.ts
    ```

:::

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

### ✅ Tooltip-related Changes

#### ✅ Import `Tooltip` from `@comet/admin` package

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/tooltip-1-update-import.ts
    ```

:::

```diff
- import { Tooltip } from "@mui/material";
+ import { Tooltip } from "@comet/admin";
```

</details>

#### ✅ Remove `trigger` prop from `Tooltip`

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

    ```sh
    npx @comet/upgrade v8/tooltip-2-remove-trigger-prop.ts
    ```

:::

The `trigger` prop has been removed. The combined `hover`/`focus` trigger is now the only supported behavior.

Example:

```diff
<Tooltip
- trigger="hover"
></Tooltip>
```

</details>

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

#### Preferable use ContentScopeProvider directly from Comet

```diff title="admin/src/App.tsx"
-   import { ContentScopeProvider } from "./common/ContentScopeProvider";
+   import { ContentScopeProvider } from "@comet/cms-admin";
    // Delete `admin/src/common/ContentScopeProvider.tsx`
```

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

### Import `Button` from `@comet/admin` package

```diff
- import { Button } from "@mui/material";
+ import { Button } from "@comet/admin";
```

## Site

### Switch from `@comet/cms-site` to `@comet/site-nextjs`

[//]: # "TODO: Upgrade script "

The `@comet/cms-site` package has been reworked and renamed to `@comet/site-nextjs`. Notable changes are

- Styled components is no longer a required peer dependency
- Instead, SCSS modules are used internally
- The package is now pure ESM

To switch you must

- uninstall `@comet/cms-site`
- install `@comet/site-nextjs`
- change all imports from `@comet/cms-site` to `@comet/site-nextjs`
- import the css file exported by the package:

```diff title="site/src/app/layout.tsx"
+ import "@comet/site-nextjs/css";
```

### ✅ Remove `graphQLFetch` from `sitePreviewRoute` calls

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/remove-graphql-fetch-from-site-preview-route.ts
```

:::

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

## ESLint

### ✅ Upgrade ESLint from v8 to v9 with ESM

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/eslint-dev-dependencies.ts
```

:::

Update ESLint to v9

`package.json`

```diff
- "eslint": "^8.0.0",
+ "eslint": "^9.0.0",
```

An ESM compatible ESLint config is required. Delete the related `.eslintrc.json` and move the configured rules to the new ESLint flat configuration `eslint.config.mjs`.

Migration Guide of ESLint 9.0 can be found here: [Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)

#### `admin/eslint.config.mjs`

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

#### `api/eslint.config.mjs`

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

#### `site/eslint.config.mjs`

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

:::warning Custom rules

If you have custom rules in your `.eslintrc.json`, you need to manually move them to the new ESLint flat configuration `eslint.config.mjs`.

:::

### Upgrade Prettier from v2 to v3

<details>

<summary>Handled by @comet/upgrade</summary>

:::note Handled by following upgrade script

```sh
npx @comet/upgrade v8/prettier-dev-dependencies.ts
```

:::

```diff
-        "prettier": "^2.8.1",
+        "prettier": "^3.4.2",
```

</details>

### Remove React barrel imports

Importing `React` is no longer necessary due to the new JSX transform, which automatically imports the necessary `react/jsx-runtime` functions.
Use individual named imports instead, e.g, `import { useState } from "react"`.

It is recommended to perform the following steps separately in the `admin/` and `site/` directories:

1. Replace `import * as React from "react";` with `import React from "react";` in your codebase (This step is optional but improves the results of the codemod).

2. Run the codemod to update React imports (option `--force` is required to because of changes of step one above):

    ```sh
    npx react-codemod update-react-imports --force
    ```

3. Run ESLint with the `--fix` option to automatically fix issues:
    ```sh
    npm run lint:eslint --fix
    ```

These steps will help automate the process of updating React imports and fixing linting issues, making the migration smoother.
The codemod does not handle all cases, so manual adjustments may still be necessary.

### ✅ Consistent type imports

<details>

<summary>Handled by @comet/upgrade</summary>

The upgrade script runs eslint with the `--fix` option. That will automatically update the imports.

#### What is the change?

To improve code consistency and readability, we now enforce the ESLint rule [@typescript-eslint/consistent-type-imports](https://typescript-eslint.io/rules/consistent-type-imports/) with the following configuration:

```typescript
"@typescript-eslint/consistent-type-imports": [
  "error",
  {
    "prefer": "type-imports",
    "disallowTypeAnnotations": false,
    "fixStyle": "inline-type-imports"
  }
]
```

#### Why this change?

This rule ensures that TypeScript type-only imports are explicitly marked with import type, leading to multiple benefits:

- **Improved Code Clarity**
  It is immediately clear that the imported symbol is used only for TypeScript type checking and not at runtime.
  Avoids confusion between runtime imports and purely static type definitions.
- **Performance & Tree-Shaking**
  TypeScript can optimize build performance since it knows which imports are needed only at compile time.
  Some bundlers can more effectively remove unused type imports, reducing bundle size.
- **Reduced Circular Dependency Issues**
  Circular dependencies can cause hard-to-debug issues in TypeScript projects.
  Using import type ensures that types do not introduce unintended runtime dependencies.

</details>

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
