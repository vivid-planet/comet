# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [next]

### @comet/admin

#### Changes

-   Added `RowActionsMenu` and `RowActionsItem` components for creating IconButtons with nested Menus and Items for actions in table rows and other listed items.

## 4.0.0

_Mar 8, 2023_

### Highlights

-   New strategy for authorization: Comet is now less opinionated on how a user should be authorized. Opinionated parts regarding authorization are removed from the packages. Various helpers to configure authorization in the application are provided.
-   New strategy for project configuration: Configurations that do not change between environments should be stored in a new `comet-config.json` file that is used in all microservices.
-   New strategy for module configuration: Configuration is only injected into the `AppModule` instead of injecting it into the separate modules. Doing so removes a significant overhead caused by asynchronous module initialization.
-   Performance improvements for requests accessing the page tree and documents: Page tree nodes may now be preloaded on a request basis. Page tree node documents are only loaded if requested by the query.
-   Add `AnchorBlock` to support linking to anchors.

### @comet/blocks-admin

#### Changes

-   Add `anchors` method to `BlockInterface` for a block to specify its anchors

### @comet/cms-admin

#### Breaking changes

-   Changes related to the new authorization strategy

    -   Remove dependency on [@comet/react-app-auth](https://www.npmjs.com/package/@comet/react-app-auth) package
    -   Remove `AuthorizationErrorPage` component
    -   Remove `access-token-service-worker.js` file. You should remove it from your build setup
    -   Remove `AccessToken` message from `IFrameBridge`
    -   Remove `authorizationManager` option from `createHttpClient`

-   Change `CmsBlockContext.damConfig.maxFileSize` from `string` to `number`
-   Change `CmsBlockContext.damConfig.maxSrcResolution` from `string` to `number`
-   Rename `Publisher` component to `PublisherPage`
-   Remove the wrapping `Chip` from `infoTag` method in `DocumentInterface`. Applications should add the `Chip` themselves:

    ```tsx
    export const Page: DocumentInterface<Pick<GQLPage, "content" | "seo">, GQLPageInput> = {
        ...
        InfoTag: ({ page }: { page: PageTreePage & GQLPageTreeNodeAdditionalFieldsFragment }) => {
            return <Chip size="small" label={page.userGroup} />;
        },
    };
    ```

-   Add `anchors` method to `DocumentInterface` for a document to specify its anchors

#### Changes

-   Add `AnchorBlock`
-   Add support for anchors to `InternalLinkBlock`
-   Add support for a custom block name to `createTextLinkBlock`

### @comet/blocks-api

#### Changes

-   Add support for a custom block name and migrations to `createTextLinkBlock`

### @comet/cms-api

-   Changes related to the new authorization strategy

    -   Remove `AuthModule`. The auth module should be created in the application using the factories provided by the package. See [AuthModule](demo/api/src/auth/auth.module.ts) for an example
    -   Remove `BasicAuthStrategy`. Use `createStaticCredentialsBasicStrategy` instead
    -   Remove `BearerTokenStrategy`. Use `createAuthProxyJwtStrategy` instead
    -   Remove `GlobalAuthGuard`. Use `createCometAuthGuard` instead

-   Changes related to the new module configuration strategy

    -   `BlocksModule`, `BlobStorageModule`, `DamModule` and `PublicUploadModule` are not initialized asynchronously anymore. See [AppModule](demo/api/src/app.module.ts) for an example

-   `BlocksTransformerMiddlewareFactory` now requires `BLOCKS_MODULE_TRANSFORMER_DEPENDENCIES` to be injected. See [AppModule](demo/api/src/app.module.ts) for an example
-   Restrict access to builds based on `ContentScopeModule`. Cron jobs and jobs need to be annotated with `comet-dxp.com/content-scope`
-   Move Kubernetes-specific parts of `BuildsModule` into a new `KubernetesModule`
-   Remove the option to configure `BuildsModule`. Configuration of the Helm release is now done in `KubernetesModule`
-   Make [@kubernetes/client-node](https://www.npmjs.com/package/@kubernetes/client-node) a peer dependency
-   Remove `BuildObject`
-   Change `DamModule.damConfig.allowedImageSizes` from `string[]` to `number[]`
-   Change `DamModule.damConfig.allowedAspectRatios` from `string[]` to `number[]`
-   Remove `damPath` from `PixelImageBlock`, `SvgImageBlock` and `DamVideoBlock`

#### Changes

-   Changes related to the new authorization strategy
    -   Add `createCometAuthGuard` to create the global application guard
    -   Add `createAuthResolver` for `currentUser` query and `currentUserSignOut` mutation
    -   Add `createAuthProxyJwtStrategy` for a JWT-based auth strategy
    -   Add `createStaticCredentialsBasicStrategy` for a basic auth strategy
    -   Add `createStaticAuthedUserStrategy` for a static user-based strategy. It should be primarily used for local development
-   Add request-scoped `PageTreeReadApiService` with `preloadNodes` method to preload pages when reading large parts of the page tree
-   Add request-scoped `BlocksTransformerService` that can be used in block field resolvers for improved performance (instead of relying on BlocksTransformerMiddlewareFactory). If all block transforms are done using field resolvers, `BlocksTransformerMiddlewareFactory` and `fieldResolverEnhancers` can be removed for additional performance improvements
-   Add `AnchorBlock`
-   Add support for anchors to `InternalLinkBlock`

### @comet/cms-site

#### Breaking changes

-   Changes related to the new authorization strategy

    -   Remove dependency on [next-auth](https://www.npmjs.com/package/next-auth) package
    -   Remove `access-token-service-worker.js` file. You should remove it from your build setup
    -   Remove `AccessToken` message from `IFrameBridge`

-   Remove the ceiling of `width` and `height` props in `Image` component

#### Changes

-   Add `AnchorBlock`
-   Add support for anchors to `InternalLinkBlock`
-   Add `getAuthedUser` and `hasAuthedUser` to parse the current user from the request

### @comet/eslint-config

#### Breaking changes

-   Enable [no-return-await](https://eslint.org/docs/latest/rules/no-return-await) rule

## Older versions

Changes before 4.x are listed in our [changelog for older versions](https://github.com/vivid-planet/comet/blob/main/CHANGELOG.old.md).
