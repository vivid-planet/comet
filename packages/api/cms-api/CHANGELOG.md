# @comet/cms-api

## 5.0.0

### Major Changes

-   dc130d16: Remove deprecated `SkipBuildInterceptor`

    The `SkipBuildInterceptor` was never intended to be part of the public API. If you want to skip a build for an operation, use the `@SkipBuild()` decorator instead.

-   c19c9271: Rename dam entitiy class to match commonly used alias (File -> DamFile, Folder -> DamFolder)
-   9d3e8555: Remove `File` entity export

    Depending on your use case, you may either use the created file entity in the application code, or the `FileInterface` export instead.

-   c91906d2: The `PageTreeModule` now requires the passed `PageTreeNode` entity to be named "PageTreeNode"
-   c91906d2: Move the `DiscoverService` from the `BlocksModule` to the new `DependenciesModule`

    The `discoverRootBlocks()` method now also returns the `graphqlObjectType` of an entity. Furthermore, a `discoverTargetEntities()` method was added that returns information about all potential dependency targets.

-   a987e17c: Api Crud Generator now supports relations in entities
-   c91906d2: Rename `BlockIndexService` to `DependenciesService` and move it from the `BlocksModule` to the new `DependenciesModule`.

    Following changes were made to the `DependenciesService`:

    -   A stale-while-revalidate approach for refreshing the view was added to `refreshViews()`. If you need the view to be updated unconditionally, you must call the method with the new `force: true` option.
    -   `getDependents()` and `getDependencies()` were added to fetch the dependents or dependencies of an entity instance from the view.

-   9d3e8555: Change `FilesService.upload` method signature

    The method now accepts an options object as first argument, and a second `scope` argument.

    **Before**

    ```ts
    await filesService.upload(file, folderId);
    ```

    **After**

    ```ts
    await filesService.upload({ file, folderId }, scope);
    ```

-   9d3e8555: Remove `Folder` entity export

    Depending on your use case, you may either use the created folder entity in the application code, or the `FolderInterface` export instead.

-   9d3e8555: Add scoping to the DAM

    The DAM scoping can be enabled optionally. You can still use the DAM without scoping.

    To enable DAM scoping, you must

    In the API:

    -   Create a DAM folder entity using `createFolderEntity({ Scope: DamScope });`
    -   Create a DAM file entity using `createFileEntity({ Scope: DamScope, Folder: DamFolder });`
    -   Pass the `Scope` DTO and the `File` and `Folder` entities when intializing the `DamModule`

    In the Admin:

    -   Set `scopeParts` in the `DamConfigProvider` (e.g. `<DamConfigProvider value={{ scopeParts: ["domain"] }}>`)
    -   Render the content scope indicator in the `DamPage`
        ```tsx
        <DamPage renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} />} />
        ```

    You can access the current DAM scope in the Admin using the `useDamScope()` hook.

    See Demo for an example on how to enable DAM scoping.

### Minor Changes

-   f2aa78c8: Improve undefined/null handling for updates

    -   Add IsUndefinable and IsNull (similar, but more specific than IsOptional from class-validator)
    -   Add custom PartialType (similar to @nestjs/mapped-types but uses IsUndefinable instead of IsOptional)

    Update api crud generator to allow partial update in update mutation:

    -   null: set to null (eg. a relation or a Date)
    -   undefined: do not touch this field

-   6b9787e6: It's now possible to opt-out of creating a redirect when changing the slug of a page

    Previously, a redirect was always created.

-   6acd2d0a: api generator: support default values

    Usage: set a default value in the entitiy, it will be used as default in the input. Null for relations
    is also supported, set undefined as default value in entity.

-   1278e6d9: api generator: generation of create/update/delete mutations is now optional

    set create/update/delete boolean of CrudGenerator decorator to false to skip those mutations

-   17165e96: API Generator: Support IDs of type string and integer (previously only UUID was supported"
-   e26bd900: Add various DAM UI/UX improvements

    -   Replace underlying `Table` with `DataGrid`
    -   Add paging to improve performance
    -   Add a dialog to move files to another folder (instead of Drag and Drop)
    -   Highlight newly uploaded files
    -   Add a new footer to execute bulk actions
    -   Add a "More Actions" dropdown above the `DataGrid` to execute bulk actions

-   8ed96981: Support Copy-Paste with DAM files across server instances by downloading the copied file
-   c49472c3: Add `calculateHashForFile()` method to `FilesService`
-   9875e7d4: Support automatically importing DAM files into another scope when copying documents from one scope to another

    The copy process was reworked:

    -   The `DocumentInterface` now requires a `dependencies()` and a `replaceDependenciesInOutput()` method
    -   The `BlockInterface` now has an optional `dependencies()` and a required `replaceDependenciesInOutput()` method
    -   `rewriteInternalLinks()` was removed from `@comet/cms-admin`. Its functionality is replaced by `replaceDependenciesInOutput()`.

    `dependencies()` returns information about dependencies of a document or block (e.g. a used `DamFile` or linked `PageTreeNode`). `replaceDependenciesInOutput()` replaces the IDs of all dependencies of a document or block with new IDs (necessary for copying documents or blocks to another scope).

    You can use the new `createDocumentRootBlocksMethods()` to generate the methods for documents.

-   3a6dab1c: searchToMikroOrmQuery (used by api generator): split search string by spaces for a better search experience
-   621c9bd2: Extend configuration options for `createAuthProxyJwtStrategy()`

    It's now possible to override the strategy and strategy options.

-   31c4779e: Api Generator: Add support for nested json and embedded properties
-   c91906d2: Add `DependenciesResolverFactory` and `DependentsResolverFactory` to easily add field resolvers for the `dependencies` or `dependents` of an entity

    You can use the factories as follows:

    ```ts
    @Module({
        // ...
        providers: [ExampleResolver, DependenciesResolverFactory.create(Example), DependentsResolverFactory.create(Example)],
        // ...
    })
    export class ExampleModule {}
    ```

-   74e4fb6a: API Generator: Support OneToOne relations
-   c6e47a3f: Add updatedAt timestamp to page tree

    Adds an updatedAt timestamp to the page tree node that is infered from the attached documents. This timestamp can be used to sort the page tree. One common use case is the "Latest Content Updates" widget, which can now be limited to the current content scope.

    Note: The updatedAt timestamp is set to the current time when the migration is executed. You will need to write an additional migration if you want the timestamp to reflect the updatedAt timestamp of the active attached document.

### Patch Changes

-   9f11ac1d: api generator: support number fields (additional to DecimalType) in filter and sort generation
-   da73c0c3: API Generator: Prevent duplicate imports in generated files
-   564f66d3: Allow `:`, `?`, `=` and `&` in redirect source paths
-   b8e040ca: API Generator: Add support for TypeScript paths (e.g., `@src/`) by using the project's TSConfig
-   1a95f4cc: Add `@SkipBuild()` decorator to mutations without content changes
-   ed13b68d: API Generator: Enums don't need to be exported from the entity file
-   c1502d14: Ignore field resolvers in `ChangesCheckerInterceptor`
-   11ec1bbf: Fix GQL Type for damItemListPosition (before Float, now Int)
-   49e85432: Expiration of JWT will be checked now. If you use this strategy, please make sure that the JWT will be refreshed (e.g. set refresh in Auth-Proxy or use updated charts).
-   1cae2388: The `updatePageTreeNode` query no longer requires an `attachedDocument` argument
-   cf49f3b9: `searchToMikroOrmQuery()` now ignores leading and trailing spaces. This fixes a bug where all rows were matched if there was a space before or after the search string.
-   Updated dependencies [c10a86c6]
-   Updated dependencies [c91906d2]
    -   @comet/blocks-api@5.0.0

## 4.7.0

### Patch Changes

-   @comet/blocks-api@4.7.0

## 4.6.0

### Patch Changes

-   f6f7d4a4: Prevent slug change of home page in `updateNode()` and `updateNodeSlug()` of `PageTreeService`
    -   @comet/blocks-api@4.6.0

## 4.5.0

### Patch Changes

-   @comet/blocks-api@4.5.0

## 4.4.3

### Patch Changes

-   @comet/blocks-api@4.4.3

## 4.4.2

### Patch Changes

-   896265c1: Fix improper validation of input when creating/updating page tree nodes or redirects
-   cd07c107: Prevent the fileUrl from being exposed in the Site via the PixelImageBlock
    -   @comet/blocks-api@4.4.2

## 4.4.1

### Patch Changes

-   @comet/blocks-api@4.4.1

## 4.4.0

### Minor Changes

-   d4960b05: Add loop toggle to YouTubeVideo block

### Patch Changes

-   53ce0682: get file stats from uploaded file in filestorage
-   11583624: Add content validation for SVG files to prevent the upload of SVGs containing JavaScript
-   Updated dependencies [d4960b05]
    -   @comet/blocks-api@4.4.0

## 4.3.0

### Minor Changes

-   afc7a6b6: Add human readable label for publisher (cron jobs and jobs)
-   b4264f18: Make changes checker scope-aware

### Patch Changes

-   44fbe3f9: add stream end when create files from buffer in filestorage
-   92f23a46: Change propagationPolicy for deleting jobs from default to Background

    Currently we use the default propagationPolicy for deleting jobs. This results in pods from jobs being deleted in k8s but not on OpenShift. With the value fixed to "Background", the jobs should get deleted on every system.
    Foreground would be blocking, so we use Background to be non blocking.

    -   @comet/blocks-api@4.3.0

## 4.2.0

### Minor Changes

-   0fdb1b33: Add new extractGraphqlFields helper function that extracts requested fields from GraphQLResolveInfo

    Usage example:

    ```
    async products(@Info() info: GraphQLResolveInfo): Promise<PaginatedProducts> {
        const fields = extractGraphqlFields(info, { root: "nodes" });
        const options: FindOptions<Product, any> = { };
        if (fields.includes("category")) options.populate = ["category"];
        //alternative if graphql structure completely matches entities: options.populate = fields;
        const [entities, totalCount] = await this.repository.findAndCount({}, options);
    ```

### Patch Changes

-   @comet/blocks-api@4.2.0

## 4.1.0

### Minor Changes

-   51466b1a: Add support for enum types to API CRUD Generator

### Patch Changes

-   51466b1a: Fix page tree node visibility update
    -   @comet/blocks-api@4.1.0
