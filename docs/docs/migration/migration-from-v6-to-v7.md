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

## Admin

### Rearrange components in `App.tsx`

-   `ErrorDialogHandler` must be beneath `MuiThemeProvider` and `IntlProvider`
-   `CurrentUserProvider` must be beneath or parallel to `ErrorDialogHandler`

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
