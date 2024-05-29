# @comet/cms-api

## 5.8.6

### Patch Changes

-   Updated dependencies [7af4e0d5e]
    -   @comet/blocks-api@5.8.6

## 5.8.5

### Patch Changes

-   @comet/blocks-api@5.8.5

## 5.8.4

### Patch Changes

-   @comet/blocks-api@5.8.4

## 5.8.3

### Patch Changes

-   91b734330: DAM: Fix the duplicate name check when updating a file

    Previously, there were two bugs:

    1. In the `EditFile` form, the `folderId` wasn't passed to the mutation
    2. In `FilesService#updateByEntity`, the duplicate check was always done against the root folder if no `folderId` was passed

    This caused an error when saving a file in any folder if there was another file with the same name in the root folder.
    And it was theoretically possible to create two files with the same name in one folder (though this was still prevented by admin-side validation).

    -   @comet/blocks-api@5.8.3

## 5.8.2

### Patch Changes

-   d6c462408: Only return duplicates within the same scope in the `FilesResolver#duplicates` field resolver

    As a side effect `FilesService#findAllByHash` now accepts an optional scope parameter.

    -   @comet/blocks-api@5.8.2

## 5.8.1

### Patch Changes

-   @comet/blocks-api@5.8.1

## 5.8.0

### Minor Changes

-   0b60e0986: Enhanced the access log functionality to now skip logging for field resolvers in GraphQL context. This change improves the readability and relevance of our logs by reducing unnecessary entries.

### Patch Changes

-   97c3f4428: Fix calculation of `totalCount` in `DependenciesService#getDependents`
-   378a1e5e5: Handle DAM scope correctly in the `findCopiesOfFileInScope` query and the `importDamFileByDownload` mutation

    Previously, these endpoints would cause errors if no DAM scoping was used.

    -   @comet/blocks-api@5.8.0

## 5.7.2

### Patch Changes

-   Updated dependencies [81a5d1d3b]
    -   @comet/blocks-api@5.7.2

## 5.7.1

### Patch Changes

-   015dee7f8: Prevent block-meta.json write in read-only file systems
    -   @comet/blocks-api@5.7.1

## 5.7.0

### Patch Changes

-   @comet/blocks-api@5.7.0

## 5.6.6

### Patch Changes

-   @comet/blocks-api@5.6.6

## 5.6.5

### Patch Changes

-   Updated dependencies [47276f84b]
    -   @comet/blocks-api@5.6.5

## 5.6.4

### Patch Changes

-   6bc4f1ef9: Always use preview DAM URLs in the admin application

    This fixes a bug where the PDF preview in the DAM wouldn't work because the file couldn't be included in an iFrame on the admin domain.

    We already intended to use preview URLs everywhere in [v5.3.0](https://github.com/vivid-planet/comet/releases/tag/v5.3.0#:~:text=Always%20use%20the%20/preview%20file%20URLs%20in%20the%20admin%20application). However, the `x-preview-dam-urls` header wasn't passed correctly to the `createFileUrl()` method everywhere. As a result, preview URLs were only used in blocks but not in the DAM. Now, the DAM uses preview URLs as well.

    -   @comet/blocks-api@5.6.4

## 5.6.3

### Patch Changes

-   @comet/blocks-api@5.6.3

## 5.6.2

### Patch Changes

-   3a55904c: Fix attached document deletion when deleting a page tree node
    -   @comet/blocks-api@5.6.2

## 5.6.1

### Patch Changes

-   @comet/blocks-api@5.6.1

## 5.6.0

### Patch Changes

-   Updated dependencies [fd10b801]
    -   @comet/blocks-api@5.6.0

## 5.5.0

### Minor Changes

-   bb2c76d8: Deprecate `FileUploadInterface` interface

    Use `FileUploadInput` instead.

-   bb2c76d8: Deprecate `download` helper

    The helper is primarily used to create a `FileUploadInput` (previously `FileUploadInterface`) input for `FilesService#upload` while creating fixtures.
    However, the name of the helper is too generic to be part of the package's public API.
    Instead, use the newly added `FileUploadService#createFileUploadInputFromUrl`.

    **Example:**

    ```ts
    @Injectable()
    class ImageFixtureService {
        constructor(private readonly filesService: FilesService, private readonly fileUploadService: FileUploadService) {}

        async generateImage(url: string): Promise<FileInterface> {
            const upload = await this.fileUploadService.createFileUploadInputFromUrl(url);
            return this.filesService.upload(upload, {});
        }
    }
    ```

### Patch Changes

-   @comet/blocks-api@5.5.0

## 5.4.0

### Minor Changes

-   e146d8bb: Support the import of files from external DAMs

    To connect an external DAM, implement a component with the necessary logic (asset picker, upload functionality, ...). Pass this component to the `DamPage` via the `additionalToolbarItems` prop.

    ```tsx
    <DamPage
        // ...
        additionalToolbarItems={<ImportFromExternalDam />}
    />
    ```

    You can find an [example](demo/admin/src/dam/ImportFromUnsplash.tsx) in the demo project.

-   27bf643b: Add `PublicUploadsService` to public API

    The service can be used to programmatically create public uploads, such as when creating fixtures.

-   df5c959c: Remove license types `MICRO` and `SUBSCRIPTION`

    The `LicenseType` enum no longer contains the values `MICRO` and `SUBSCRIPTION`. The database migration will automatically update all licenses of type `MICRO` or `SUBSCRIPTION` to `RIGHTS_MANAGED`.

### Patch Changes

-   60f5208e: Fix encoding of special characters in names of uploaded files

    For example:

    Previously:

    -   `€.jpg` -> `a.jpg`
    -   `ä.jpg` -> `ai.jpg`

    Now:

    -   `€.jpg` -> `euro.jpg`
    -   `ä.jpg` -> `ae.jpg`
    -   @comet/blocks-api@5.4.0

## 5.3.0

### Minor Changes

-   570fdbc8: CRUD Generator: Add support for `ArrayType` fields in generated input
-   8d0e3ee1: CRUD Generator: Add support for enum arrays in input

### Patch Changes

-   dfb3c840: CRUD Generator: Correctly support `type: "text"` fields in filter and sort
-   c883d351: Consider filtered mimetypes when calculating the position of a DAM item in `DamItemsService`'s `getDamItemPosition()`

    Previously, the mimetypes were ignored, sometimes resulting in an incorrect position.

-   Updated dependencies [920f2b85]
    -   @comet/blocks-api@5.3.0

## 5.2.0

### Minor Changes

-   bbc0a0a5: Add access logging to log information about the request to standard output. The log contains information about the requester and the request itself. This can be useful for fulfilling legal requirements regarding data integrity or for forensics.

    There are two ways to integrate logging into an application:

    **First option: Use the default implementation**

    ```ts
    imports: [
        ...
        AccessLogModule,
        ...
    ]
    ```

    **Second option: Configure logging**

    Use the `shouldLogRequest` to prevent logging for specific requests. For instance, one may filter requests for system users.

    ```ts
    imports: [
        ...
        AccessLogModule.forRoot({
            shouldLogRequest: ({user, req}) => {
                // do something
                return true; //or false
            },
        }),
        ...
    ]
    ```

    More information can be found in the documentation under 'Authentication > Access Logging'.

### Patch Changes

-   1a170b9b: API Generator: Use correct type for `where` when `getFindCondition` service method is not used
-   6b240a01: CRUD Generator: Correctly support `type: "text"` fields in input
    -   @comet/blocks-api@5.2.0

## 5.1.0

### Patch Changes

-   @comet/blocks-api@5.1.0

## 5.0.0

### Major Changes

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

    See the [Demo project](https://github.com/vivid-planet/comet/pull/976) for an example on how to enable DAM scoping.

-   9d3e8555: Remove `File` entity export

    Depending on your use case, you may either use the file entity created by `createFileEntity()` in the application code, or the `FileInterface` export instead.

-   9d3e8555: Remove `Folder` entity export

    Depending on your use case, you may either use the folder entity created by `createFolderEntity()` in the application code, or the `FolderInterface` export instead.

-   c19c9271: Rename the DAM entity classes to match their commonly used aliases (`File` -> `DamFile`, `Folder` -> `DamFolder`)

-   9d3e8555: Change `FilesService.upload()` method signature

    The method now accepts an options object with a `scope` field as second argument.

    **Before**

    ```ts
    await filesService.upload(file, folderId);
    ```

    **After**

    ```ts
    await filesService.upload(file, { folderId, scope });
    ```

-   c91906d2: Move the `DiscoverService` from the `BlocksModule` to the new `DependenciesModule`

    The `discoverRootBlocks()` method now also returns the `graphqlObjectType` of an entity. Furthermore, a `discoverTargetEntities()` method was added that returns information about all potential dependency targets.

-   c91906d2: Rename `BlockIndexService` to `DependenciesService` and move it from the `BlocksModule` to the new `DependenciesModule`.

    Following changes were made to the `DependenciesService`:

    -   A stale-while-revalidate approach for refreshing the view was added to `refreshViews()`. If you need the view to be updated unconditionally, you must call the method with the new `force: true` option.
    -   `getDependents()` and `getDependencies()` were added to fetch the dependents or dependencies of an entity instance from the view.

-   dc130d16: Remove deprecated `SkipBuildInterceptor`

    The `SkipBuildInterceptor` was never intended to be part of the public API. If you want to skip a build for an operation, use the `@SkipBuild()` decorator instead.

-   c91906d2: The `PageTreeModule` now requires the passed `PageTreeNode` entity to be named "PageTreeNode"
-   API CRUD Generator:
    -   a987e17c: Support relations in entities

### Minor Changes

-   f2aa78c8: Improve undefined/null handling for update mutations

    -   Add `@IsUndefinable()` and `@IsNull()` validators intended to be used in input types (similar, but more specific than `@IsOptional()` from `class-validator`)
    -   Add custom `PartialType` intended to be used for update input types (similar to `@nestjs/mapped-types` but uses `@IsUndefinable()` instead of `@IsOptional()`)

-   9875e7d4: Support automatically importing DAM files into another scope when copying documents from one scope to another
-   8ed96981: Support copy/pasting DAM files across server instances by downloading the copied file
-   6b9787e6: Offer possibility to opt-out of creating a redirect when changing the slug of a page (previously, a redirect was always created)
-   c49472c3: Add `calculateHashForFile()` method to `FilesService`
-   3a6dab1c: `searchToMikroOrmQuery()` now splits search string by spaces for a better search experience
-   621c9bd2: Extend configuration options for `createAuthProxyJwtStrategy()`. It's now possible to override the strategy and strategy options.
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

-   c6e47a3f: Add `updatedAt` timestamp to `PageTreeNode`

    Adds an `updatedAt` timestamp to the`PageTreeNode` that is inferred from the attached documents. This timestamp can be used to sort the PageTree. One common use case is the `LatestContentUpdatesDashboardWidget`, which can now be limited to the current content scope.

    Note: The `updatedAt` timestamp is set to the current time when the migration is executed. You will need to write an additional migration if you want the timestamp to reflect the `updatedAt` timestamp of the active attached document.

-   API CRUD Generator:

    -   f2aa78c8: Update API CRUD Generator to allow partial update in update mutations:

        -   passing `null` for a field means: set this field to null (e.g. a relation or a Date)
        -   passing `undefined` for a field means: do not change this field (keep the previous value)

    -   6acd2d0a: Support default values

        Usage: Set a default value in the entity and it will be used as default in the generated input type. `null` for relations is also supported by setting the default value in the entity to `undefined`.

    -   1278e6d9: Generation of create/update/delete mutations is now optional

        Setting create/update/delete boolean of `@CrudGenerator()` decorator to false will skip the generation of these mutations

    -   17165e96: Support IDs of type string and integer (previously only UUID was supported)
    -   31c4779e: Add support for nested json and embedded properties

### Patch Changes

-   564f66d3: Allow `:`, `?`, `=` and `&` in redirect source paths
-   b8e040ca: API Generator: Add support for TypeScript paths (e.g., `@src/`) by using the project's TSConfig
-   1a95f4cc: Add `@SkipBuild()` decorator to mutations without content changes
-   c1502d14: Ignore field resolvers in `ChangesCheckerInterceptor`
-   11ec1bbf: Fix GQL Type for `damItemListPosition` query (before Float, now Int)
-   49e85432: Expiration of JWT will be checked now. If you use this strategy, please make sure that the JWT will be refreshed (e.g. set refresh in Auth-Proxy or use updated charts).
-   1cae2388: The `updatePageTreeNode` query no longer requires an `attachedDocument` argument
-   cf49f3b9: `searchToMikroOrmQuery()` now ignores leading and trailing spaces. This fixes a bug where all rows were matched if there was a space before or after the search string.
-   API CRUD Generator:
-   9f11ac1d: Support number fields (additional to DecimalType) in filter and sort generation
-   da73c0c3: Prevent duplicate imports in generated files
-   ed13b68d: Enums don't need to be exported from the entity file anymore
-   b8e040ca: Add support for TypeScript paths (e.g., `@src/`) by using the project's TSConfig
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
