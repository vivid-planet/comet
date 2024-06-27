# @comet/cms-api

## 6.14.1

### Patch Changes

-   @comet/blocks-api@6.14.1

## 6.14.0

### Minor Changes

-   73dfb61c9: Add `PhoneLinkBlock` and `EmailLinkBlock`
-   dddb03d1b: Add capability to generate alt texts and titles for images in DAM

    You can find instructions for adding this feature to your project [in the docs](https://docs.comet-dxp.com/docs/content-generation/).

-   73dfb61c9: Add `IsPhoneNumber` and `isPhoneNumber` validators to validate phone numbers

### Patch Changes

-   b7dbd7a18: Export `DisablePermissionCheck` constant to enable usage in application code
-   Updated dependencies [73dfb61c9]
-   Updated dependencies [87ef5fa36]
    -   @comet/blocks-api@6.14.0

## 6.13.0

### Minor Changes

-   2a5e00bfb: API Generator: Add `list` option to `@CrudGenerator()` to allow disabling the list query

    Related DTO classes will still be generated as they might be useful for application code.

-   dcf3f70f4: Add `overrideAcceptedMimeTypes` configuration to DAM

    If set, only the mimetypes specified in `overrideAcceptedMimeTypes` will be accepted.

    You must configure `overrideAcceptedMimeTypes` in the API and the admin interface:

    API:

    ```diff
    // app.module.ts

    DamModule.register({
        damConfig: {
            // ...
    +       overrideAcceptedMimeTypes: ["image/png"],
            // ...
        },
        // ...
    }),
    ```

    Admin:

    ```diff
    // App.tsx

    <DamConfigProvider
        value={{
            // ...
    +       overrideAcceptedMimeTypes: ["image/png"],
        }}
    >
    ```

-   07a7291fe: Adjust `searchToMikroOrmQuery` function to reduce the amount of irrelevant results

    This is done by using a combination of AND- and OR-queries. For example, a search of `red shirt` won't give all products containing `red` OR `shirt` but rather returns all products that have the words `red` AND `shirt` in some column. The words don't have to be in the same column.

### Patch Changes

-   5bbb2ee76: API Generator: Don't add `skipScopeCheck` when the entity has a `@ScopedEntity()` decorator
-   ebdd108f0: API Generator: Fix imports in generated code for more than one level deep relations
-   b925f940f: API Generator: Support relation with primary key type `int` (in addition to `integer`)
    -   @comet/blocks-api@6.13.0

## 6.12.0

### Minor Changes

-   3ee8c7a33: Add a `DamFileDownloadLinkBlock` that can be used to download a file or open it in a new tab

    Also, add new `/dam/files/download/:hash/:fileId/:filename` endpoint for downloading assets.

-   0597b1e0a: Add `DisablePermissionCheck` constant for use in `@RequiredPermission` decorator

    You can disable authorization for a resolver or operation by adding the decorator `@RequiredPermission(DisablePermissionCheck)`

### Patch Changes

-   67176820c: API CrudSingleGenerator: Run `transformToBlockData()` for block fields on create
-   b158e6a2c: ChangesCheckerConsole: Start exactly matching job or all partially matching jobs

    Previously, the first job with a partially matching content scope was started.
    Doing so could lead to problems when multiple jobs with overlapping content scopes exist.
    For instance, jobs with the scopes `{ domain: "main", language: "de" }` and `{ domain: "main", language: "en" }` both partially match a change in `{ domain: "main", language: "de" }`.
    To fix this, we either start a single job if the content scope matches exactly or start all jobs with partially matching content scopes.

    -   @comet/blocks-api@6.12.0

## 6.11.0

### Minor Changes

-   0db10a5f8: Add a console script to import redirects from a csv file

    You can use the script like this: `npm run console import-redirects file-to-import.csv`

    The CSV file must look like this:

    ```csv
    source;target;target_type;comment;scope_domain
    /test-source;/test-target;internal;Internal Example;main
    /test-source-external;https://www.comet-dxp.com/;external;External Example;secondary
    ```

### Patch Changes

-   Updated dependencies [93a84b651]
    -   @comet/blocks-api@6.11.0

## 6.10.0

### Minor Changes

-   536fdb85a: Add `createUserFromIdToken` to `UserService`-interface

    This allows to override the default implementation of creating the User-Object from the JWT when logging in via `createAuthProxyJwtStrategy`

-   f528bc340: CronJobModule: Show logs for job run

### Patch Changes

-   d340cabc2: DAM: Fix the duplicate name check when updating a file

    Previously, there were two bugs:

    1. In the `EditFile` form, the `folderId` wasn't passed to the mutation
    2. In `FilesService#updateByEntity`, the duplicate check was always done against the root folder if no `folderId` was passed

    This caused an error when saving a file in any folder if there was another file with the same name in the root folder.
    And it was theoretically possible to create two files with the same name in one folder (though this was still prevented by admin-side validation).

-   584d14d86: Only return duplicates within the same scope in the `FilesResolver#duplicates` field resolver

    As a side effect `FilesService#findAllByHash` now accepts an optional scope parameter.

    -   @comet/blocks-api@6.10.0

## 6.9.0

### Minor Changes

-   94ac6b729: API Generator: Fix generated API for many-to-many-relations with custom relation entity

### Patch Changes

-   Updated dependencies [8be9565d1]
    -   @comet/blocks-api@6.9.0

## 6.8.0

### Minor Changes

-   d6ca50a52: Enhanced the access log functionality to now skip logging for field resolvers in GraphQL context. This change improves the readability and relevance of our logs by reducing unnecessary entries.
-   ebdbabc21: Extend `searchToMikroOrmQuery` function to support quoted search strings.

    Quotes searches can be done with single (`'...'`) or double quotation marks (`"..."`).

### Patch Changes

-   35efa037b: API-Generator: Remove unnecessary await for delete mutation
-   d3a06fcaf: Prevent block-meta.json write in read-only file systems
-   a696ec7b9: Handle DAM scope correctly in the `findCopiesOfFileInScope` query and the `importDamFileByDownload` mutation

    Previously, these endpoints would cause errors if no DAM scoping was used.

-   Updated dependencies [be8664c75]
-   Updated dependencies [90c6f192e]
-   Updated dependencies [90c6f192e]
    -   @comet/blocks-api@6.8.0

## 6.7.0

### Minor Changes

-   645f19df9: Add `nullable` param to `@AffectedEntity` to support id args that can be `null` or `undefined`
-   a0506e103: API Generator: Support validator decorators for input generation

### Patch Changes

-   645f19df9: Fix mutations `moveDamFiles`, `copyFilesToScope`, `archiveDamFiles` and `restoreDamFiles` by adding `@AffectedEntity` to enable scope checks
-   8315f10cb: Fix order of `@RequiredPermission()` decorators

    Decorators defined on handlers should be considered before decorators defined on classes.

-   6eeaaa223: The CometAuthGuards now only creates the `CurrentUser` just on a request-basis and skips when called in a fieldResolver (e.g. when `fieldResolverEnhancers` contains `guards`).
    -   @comet/blocks-api@6.7.0

## 6.6.2

### Patch Changes

-   @comet/blocks-api@6.6.2

## 6.6.1

### Patch Changes

-   890795fda: Fix calculation of `totalCount` in `DependenciesService#getDependents`
    -   @comet/blocks-api@6.6.1

## 6.6.0

### Minor Changes

-   6160119fe: Provide a `User`-interface that allows module augmentation and hence storing additional data.
-   38df2b4de: Add `userToLog`-option to AccessLogModule

### Patch Changes

-   Updated dependencies [e880929d8]
    -   @comet/blocks-api@6.6.0

## 6.5.0

### Minor Changes

-   2f64daa9b: Add `title` field to link block

    Perform the following steps to use it in an application:

    1. API: Use the new `createLinkBlock` factory to create the LinkBlock:

        ```ts
        import { createLinkBlock } from "@comet/cms-api";

        // ...

        const LinkBlock = createLinkBlock({
            supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, news: NewsLinkBlock },
        });
        ```

    2. Site: Pass the `title` prop to LinkBlock's child blocks:

    ```diff
    const supportedBlocks: SupportedBlocks = {
    -   internal: ({ children, ...props }) => <InternalLinkBlock data={props}>{children}</InternalLinkBlock>,
    +   internal: ({ children, title, ...props }) => <InternalLinkBlock data={props} title={title}>{children}</InternalLinkBlock>,
        // ...
    };
    ```

### Patch Changes

-   Updated dependencies [2f64daa9b]
    -   @comet/blocks-api@6.5.0

## 6.4.0

### Minor Changes

-   9ff9d9840: Support using a service in `@ScopedEntity()` decorator

    This can be useful when an entity's scope cannot be derived directly from the passed entity.
    For example, a `Page` document's scope is derived by the `PageTreeNode` the document is attached to, but there is no database relation between the two entities.

    For page tree document types you can use the provided `PageTreeNodeDocumentEntityScopeService`.

-   955182b09: Make permission-check for field-resolvers optional
-   322da3831: Add `@EntityInfo()` decorator

    Adding `@EntityInfo()` to an entity is necessary to correctly display dependencies in the admin application.
    You can find more information in [the docs](https://docs.comet-dxp.com/docs/dependencies/).

-   1910551c7: Log the correct user IP even if the app is behind a proxy

    The package [request-ip](https://www.npmjs.com/package/request-ip) is now used to get the actual user IP even if the app runs behind a proxy. Previously, the proxy's IP was logged.

-   2d1b9467a: createImageLinkBlock: Allow overriding name

    This allows using two different `ImageLink` blocks in one application.

    Perform the following steps to override the name:

    1. API: Add the name as second argument in the `createImageLinkBlock` factory:

        ```diff
        const MyCustomImageLinkBlock = createImageLinkBlock(
            { link: InternalLinkBlock },
        +   "MyCustomImageLink"
        );
        ```

    2. Admin: Set the `name` option in the `createImageLinkBlock` factory:

        ```diff
        const MyCustomImageLinkBlock = createImageLinkBlock({
            link: InternalLinkBlock,
        +   name: "MyCustomImageLink"
        });
        ```

### Patch Changes

-   8568153d8: API Generator: Add missing `ObjectQuery` import
-   1910551c7: Remove user name from access log

    We decided to remove the user name because of privacy concerns.

-   bfc1a4614: API Generator: Correctly support default value for date fields
-   b478a8b71: Don't fail in ChangesCheckerInterceptor because of stricter content scope check
-   Updated dependencies [0efae68ff]
    -   @comet/blocks-api@6.4.0

## 6.3.0

### Minor Changes

-   fc1b16fe: Allow overriding the block context in `BlocksTransformerService#transformToPlain`

### Patch Changes

-   e2e2114b: Fix parsing of `contentScopeAnnotation` in `KubernetesService#getContentScope`
    -   @comet/blocks-api@6.3.0

## 6.2.1

### Patch Changes

-   f1457306: Ignore user permissions when using system user

    The `UserPermissionsGuard` didn't allow requests when using a system user (e.g., basic authorization during site build).

    -   @comet/blocks-api@6.2.1

## 6.2.0

### Minor Changes

-   beeea1dd: Remove `availablePermissions`-option in `UserPermissionsModule`

    Simply remove the `Permission` interface module augmentation and the `availablePermissions`-option from the application.

-   151e1218: Support multiple `@AffectedEntity()`-decorators for a single function

### Patch Changes

-   04afb3ee: Fix attached document deletion when deleting a page tree node
-   ad153c99: Always use preview DAM URLs in the admin application

    This fixes a bug where the PDF preview in the DAM wouldn't work because the file couldn't be included in an iFrame on the admin domain.

    We already intended to use preview URLs everywhere in [v5.3.0](https://github.com/vivid-planet/comet/releases/tag/v5.3.0#:~:text=Always%20use%20the%20/preview%20file%20URLs%20in%20the%20admin%20application). However, the `x-preview-dam-urls` header wasn't passed correctly to the `createFileUrl()` method everywhere. As a result, preview URLs were only used in blocks but not in the DAM. Now, the DAM uses preview URLs as well.

-   Updated dependencies [75865caa]
    -   @comet/blocks-api@6.2.0

## 6.1.0

### Minor Changes

-   7ea43eb3: Make the `UserService`-option of the `UserPermissionsModule` optional.

    The service is still necessary though for the Administration-Panel.

-   86cd5c63: Allow a callback for the `availableContentScopes`-option of the `UserPermissionsModule`

    Please be aware that when using this possibility to make sure to cache the
    response properly as this is called for every request to the API.

-   737ab3b9: Allow returning multiple content scopes in `ScopedEntity`-decorator
-   f416510b: Remove `CurrentUserLoader` and `CurrentUserInterface`

    Overriding the the current user in the application isn't supported anymore when using the new `UserPermissionsModule`, which provides the current user DTO itself.

### Patch Changes

-   ef84331f: Fix type of @RequiredPermission to accept a non-array string for a single permission
-   8e158f8d: Add missing `@RequiredPermission()` decorator to `FileLicensesResolver`
-   50184410: API Generator: Add missing `scope` argument and filter to `<entity>BySlug` query
-   1f6c58e8: API Generator: support GraphQLJSONObject input for fields that are not a InputType class
    -   @comet/blocks-api@6.1.0

## 6.0.0

### Major Changes

-   d20f59c0: Enhance CronJob module

    -   Show latest job run on `CronJobsPage`
    -   Add option to manually trigger cron jobs to `CronJobsPage`
    -   Add subpage to `CronJobsPage` that shows all job runs

    Warning: Only include this module if all your users should be able to trigger cron jobs manually or you have sufficient access control in place.

    Includes the following breaking changes:

    -   Rename `JobStatus` to `KubernetesJobStatus` to avoid naming conflicts
    -   Rename `BuildRuntime` to `JobRuntime`

-   b3ceaef1: Replace ContentScopeModule with UserPermissionsModule

    Breaking changes:

    -   ContentScope-Module has been removed
    -   canAccessScope has been moved to AccessControlService and refactored into isAllowed
    -   contentScopes- and permissions-fields have been added to CurrentUser-Object
    -   role- and rights-fields has been removed from CurrentUser-Object
    -   AllowForRole-decorator has been removed
    -   Rename decorator SubjectEntity to AffectedEntity
    -   Add RequiredPermission-decorator and make it mandatory when using UserPermissionsModule

    Upgrade-Guide: tbd

### Patch Changes

-   @comet/blocks-api@6.0.0

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
