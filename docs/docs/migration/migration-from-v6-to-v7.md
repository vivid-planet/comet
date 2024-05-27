---
title: Migrating from v6 to v7
sidebar_position: 1
---

# Migrating from v6 to v7

First, execute `npx @comet/upgrade@latest v7` in the root of your project.
It automatically installs the new versions of all `@comet` libraries, runs an ESLint autofix and handles some of the necessary renames.

<details>

<summary>Changes handled by @comet/upgrade</summary>

-   Disabling GraphQL field suggestions
-   Importing the types of `@comet/admin-theme` in `vendors.d.ts`
-   Replacing the Roboto font with Roboto Flex

</details>

## API

### Support dependency injection in `BlockData#transformToPlain`

1. Remove dynamic registration of `BlocksModule`:

    ```diff
    // In api/src/app.module.ts
    - BlocksModule.forRoot({
    -     imports: [PagesModule],
    -     useFactory: (pageTreeService: PageTreeService, filesService: FilesService, imagesService: ImagesService) => {
    -         return {
    -             transformerDependencies: {
    -                 pageTreeService,
    -                 filesService,
    -                 imagesService,
    -             },
    -         };
    -     },
    -     inject: [PageTreeService, FilesService, ImagesService],
    - }),
    + BlocksModule,
    ```

2. Pass `moduleRef` to `BlocksTransformerMiddlewareFactory` instead of `dependencies`

    ```diff
    // In api/src/app.module.ts
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
        ...
    -   useFactory: (dependencies: Record<string, unknown>) => ({
    +   useFactory: (moduleRef: ModuleRef) => ({
            ...
            buildSchemaOptions: {
    -           fieldMiddleware: [BlocksTransformerMiddlewareFactory.create(dependencies)],
    +           fieldMiddleware: [BlocksTransformerMiddlewareFactory.create(moduleRef)],
            },
        }),
    -   inject: [BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES],
    +   inject: [ModuleRef],
    }),
    ```

3. Remove `dependencies` from `BlockData#transformToPlain` calls:

    ```diff
    class NewsLinkBlockData {
        ...
    -   transformToPlain(dependencies: TransformDependencies, context: BlockContext)
    +   transformToPlain(context: BlockContext)
    }
    ```

4. Convert existing `BlockData#transformToPlain` calls to new technqiue.
   This is only necessary if you have blocks that load additional data in `tranformToPlain`:

    **Before**

    ```ts
    // news-link.block.ts

    class NewsLinkBlockData extends BlockData {
        @BlockField({ nullable: true })
        id?: string;

        // Poor man's dependency injection using dependencies object
        transformToPlain({ newsRepository }: { newsRepository: EntityRepository<News> }) {
            if (!this.id) {
                return {};
            }

            const news = await newsRepository.findOneOrFail(this..id);

            return {
                news: {
                    id: news.id,
                    slug: news.slug,
                },
            };
        }
    }
    ```

    **After**

    ```ts
    // news-link.block.ts
    class NewsLinkBlockData extends BlockData {
        @BlockField({ nullable: true })
        id?: string;

        transformToPlain() {
            // Return service that does the transformation
            return NewsLinkBlockTransformerService;
        }
    }

    type TransformResponse = {
        news?: {
            id: string;
            slug: string;
        };
    };

    @Injectable()
    class NewsLinkBlockTransformerService
        implements BlockTransformerServiceInterface<NewsLinkBlockData, TransformResponse>
    {
        // Use dependency injection here
        constructor(@InjectRepository(News) private readonly repository: EntityRepository<News>) {}

        async transformToPlain(block: NewsLinkBlockData, context: BlockContext) {
            if (!block.id) {
                return {};
            }

            const news = await this.repository.findOneOrFail(block.id);

            return {
                news: {
                    id: news.id,
                    slug: news.slug,
                },
            };
        }
    }
    ```

### Provide `strategyName` in createStaticCredentialsBasicStrategy

Make sure to use a meaningful strategy name as this name can be used to identify the user when using this strategy more than once. Do not forget to add the strategy to the App Guard.

```diff
  createStaticCredentialsBasicStrategy({
      password: "xxxxx",
+     strategyName: "system-user",
  }),
```

```diff
  {
      provide: APP_GUARD,
-     useClass: createCometAuthGuard(["static-credentials-basic", "..."]),
+     useClass: createCometAuthGuard(["system-user", "..."]),
  };
```

```diff
  UserPermissionsModule.forRootAsync({
      useFactory: (...) => ({
+         systemUsers: ["system-user"],
          ...
      }),
      ...
  }),
```

### Remove CDN config from DAM

```diff
// app.module.ts

DamModule.register({
   damConfig: {
-     filesBaseUrl: `${config.apiUrl}/dam/files`,
-     imagesBaseUrl: `${config.apiUrl}/dam/images`,
+     apiUrl: config.apiUrl,
      // ...
   }
})
```

#### How to migrate (only required if CDN is used):

Remove the following env vars from the API

```diff
//.env

- DAM_CDN_ENABLED=
- DAM_CDN_DOMAIN=
- DAM_CDN_ORIGIN_HEADER=
- DAM_DISABLE_CDN_ORIGIN_HEADER_CHECK=false
```

If you want to enable the origin check:

1. Set the following env vars for the API

    ```diff
    // .env

    + CDN_ORIGIN_CHECK_SECRET="Use value from DAM_CDN_ORIGIN_HEADER to avoid downtime"
    ```

    _environment-variables.ts_

    ```diff
    // environment-variables.ts

    + @IsString()
    + @ValidateIf(() => process.env.NODE_ENV === "production")
    + CDN_ORIGIN_CHECK_SECRET: string;
    ```

    ```
    // config.ts

    + cdn: {
    +  originCheckSecret: envVars.CDN_ORIGIN_CHECK_SECRET,
    + },
    ```

2. Add CdnGuard

    ```diff
    // main.ts

    + // if CDN is enabled, make sure all traffic is either coming from the CDN or internal sources
    + if (config.cdn.originCheckSecret) {
    +   app.useGlobalGuards(new CdnGuard({ headerName: "x-cdn-origin-check", headerValue: config.cdn.originCheckSecret }));
    + }
    ```

3. Adjust `site/server.js`

```diff
// site/server.js

- const cdnEnabled = process.env.CDN_ENABLED === "true";
- const disableCdnOriginHeaderCheck = process.env.DISABLE_CDN_ORIGIN_HEADER_CHECK === "true";
- const cdnOriginHeader = process.env.CDN_ORIGIN_HEADER;
+ const cdnOriginCheckSecret = process.env.CDN_ORIGIN_CHECK_SECRET;

// ...

- if (cdnEnabled && !disableCdnOriginHeaderCheck) {
-    const incomingCdnOriginHeader = req.headers["x-cdn-origin-check"];
-    if (cdnOriginHeader !== incomingCdnOriginHeader) {
+ if (cdnOriginCheckSecret) {
+    if (req.headers["x-cdn-origin-check"] !== cdnOriginCheckSecret) {
```

4. DNS changes might be required. `api.example.com` should point to CDN, CDN should point to internal API domain

## Admin

### Rearrange components in `App.tsx`

-   `ErrorDialogHandler` must be beneath `MuiThemeProvider` and `IntlProvider`
-   `CurrentUserProvider` must be beneath or parallel to `ErrorDialogHandler`

## Site

### Make relative DAM URLs work

#### Pages Router

```diff
// next.config.js

const nextConfig = {
    rewrites: async () => {
        if (process.env.NEXT_PUBLIC_SITE_IS_PREVIEW === "true") return [];
        var rewrites = await require("./preBuild/build/preBuild/src/createRewrites").createRewrites();
-       return rewrites;
+       return [
+           ...rewrites,
+           {
+               source: "/dam/:path*",
+               destination: process.env.API_URL + "/dam/:path*",
+           },
+       ];
    },
    // ...
```

#### App Router

```diff
// middleware.ts

export async function middleware(request: NextRequest) {
+   if (request.nextUrl.pathname.startsWith("/dam")) {
+       return NextResponse.rewrite(new URL(`${process.env.API_URL_INTERNAL}${request.nextUrl.pathname}`));
+   }
    // ...
```

## ESLint

### PascalCase in Enums

We now enforce PascalCase for enums.
If your project has enums that are cased differently, you should change the casing.

In some cases, changing the enum casing can be problematic.
For example, if the enum value is stored in the database.
In such cases, you can disable the rule like so

```diff
+ /* eslint-disable @typescript-eslint/naming-convention */
  export enum ExampleEnum {
      attr1 = "attr1",
  }
+ /* eslint-enable @typescript-eslint/naming-convention */
```
