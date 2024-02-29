# @comet/cms-admin

## 6.1.0

### Patch Changes

-   7ea5f61f: Use `useCurrentUser` hook where possible
-   693cbdb4: Add loading state for edit `StackPage` in `PagesPage`

    Prevents flash of "Document not found" error message when reloading the page editor

-   Updated dependencies [dcfa03ca]
-   Updated dependencies [08e0da09]
-   Updated dependencies [b35bb8d1]
-   Updated dependencies [f1fc9e20]
-   Updated dependencies [8eb13750]
-   Updated dependencies [a4fac913]
    -   @comet/admin@6.1.0
    -   @comet/admin-icons@6.1.0
    -   @comet/admin-rte@6.1.0
    -   @comet/admin-theme@6.1.0
    -   @comet/admin-date-time@6.1.0
    -   @comet/blocks-admin@6.1.0

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

-   d86d5a90: Make sites config generic

    The sites config was previously assumed to be `Record<string, SiteConfg>`.
    However, as the sites config is solely used in application code, it could be of any shape.
    Therefore, the `SitesConfigProvider` and `useSitesConfig` are made generic.
    The following changes have to be made in the application:

    1.  Define the type of your sites config

        Preferably this should be done in `config.ts`:

        ```diff
        export function createConfig() {
            // ...

            return {
                ...cometConfig,
                apiUrl: environmentVariables.API_URL,
                adminUrl: environmentVariables.ADMIN_URL,
        +       sitesConfig: JSON.parse(environmentVariables.SITES_CONFIG) as SitesConfig,
            };
        }

        + export type SitesConfig = Record<string, SiteConfig>;
        ```

    2.  Use the type when using `useSitesConfig`

        ```diff
        - const sitesConfig = useSitesConfig();
        + const sitesConfig = useSitesConfig<SitesConfig>();
        ```

    3.  Optional: Remove type annotation from `ContentScopeProvider#resolveSiteConfigForScope` (as it's now inferred)

        ```diff
        - resolveSiteConfigForScope: (configs: Record<string, SiteConfig>, scope: ContentScope) => configs[scope.domain],
        + resolveSiteConfigForScope: (configs, scope: ContentScope) => configs[scope.domain],
        ```

### Minor Changes

-   0f814c5e: Add `MasterMenu` and `MasterMenuRoutes` components which both take a single data structure to define menu and routes.

### Patch Changes

-   Updated dependencies [921f6378]
-   Updated dependencies [76e50aa8]
-   Updated dependencies [298b63b7]
-   Updated dependencies [803f5045]
-   Updated dependencies [a525766c]
-   Updated dependencies [0d768540]
-   Updated dependencies [62779124]
    -   @comet/admin@6.0.0
    -   @comet/admin-icons@6.0.0
    -   @comet/admin-rte@6.0.0
    -   @comet/admin-date-time@6.0.0
    -   @comet/blocks-admin@6.0.0
    -   @comet/admin-theme@6.0.0

## 5.6.0

### Minor Changes

-   fe26a6e6: Show an error message when trying to edit a non-existing document and when trying to edit an archived document
-   3ee4ce09: Return newly uploaded items from `useDamFileUpload#uploadFiles`

### Patch Changes

-   Updated dependencies [fb6c8063]
-   Updated dependencies [76f85abe]
    -   @comet/admin-theme@5.6.0
    -   @comet/blocks-admin@5.6.0
    -   @comet/admin@5.6.0
    -   @comet/admin-date-time@5.6.0
    -   @comet/admin-icons@5.6.0
    -   @comet/admin-rte@5.6.0

## 5.5.0

### Patch Changes

-   1b37b1f6: Show `additionalToolbarItems` in `ChooseFileDialog`

    The `additionalToolbarItems` were only shown inside the `DamPage`, but not in the `ChooseFileDialog`.
    To fix this, use the `additionalToolbarItems` option in `DamConfigProvider`.
    The `additionalToolbarItems` prop of `DamPage` has been deprecated in favor of this option.

    **Previously:**

    ```tsx
    <DamPage
        // ...
        additionalToolbarItems={<ImportFromExternalDam />}
    />
    ```

    **Now:**

    ```tsx
    <DamConfigProvider
        value={{
            // ...
            additionalToolbarItems: <ImportFromExternalDam />,
        }}
    >
        {/*...*/}
    </DamConfigProvider>
    ```

-   85aa962c: Set unhandled dependencies to `undefined` when copying documents to another scope

    This prevents leaks between scopes. In practice, this mostly concerns links to documents that don't exist in the target scope.

    **Example:**

    -   Page A links to Page B
    -   Page A is copied from Scope A to Scope B
    -   Link to Page B is removed from Page A by replacing the `id` with `undefined` (since Page B doesn't exist in Scope B)

    **Note:** The link is only retained if both pages are copied in the same operation.

-   c4639be5: Clip crop values when cropping an image in the DAM or `PixelImageBlock`

    Previously, negative values could occur, causing the image proxy to fail on delivery.

    -   @comet/admin@5.5.0
    -   @comet/admin-date-time@5.5.0
    -   @comet/admin-icons@5.5.0
    -   @comet/admin-rte@5.5.0
    -   @comet/admin-theme@5.5.0
    -   @comet/blocks-admin@5.5.0

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

-   51d6c2b9: Move soft-hyphen functionality to `@comet/admin-rte`

    This allows using the soft-hyphen functionality in plain RTEs, and not only in `RichTextBlock`

    ```tsx
    const [useRteApi] = makeRteApi();

    export default function MyRte() {
        const { editorState, setEditorState } = useRteApi();
        return (
            <Rte
                value={editorState}
                onChange={setEditorState}
                options={{
                    supports: [
                        // Soft Hyphen
                        "soft-hyphen",
                        // Other options you may wish to support
                        "bold",
                        "italic",
                    ],
                }}
            />
        );
    }
    ```

-   dcaf750d: Make all DAM license fields optional if `LicenseType` is `ROYALTY_FREE` even if `requireLicense` is true in `DamConfig`

### Patch Changes

-   087cb01d: Enable copying documents from one `PageTree` category to another (e.g. from "Main navigation" to "Top menu" in Demo)
-   Updated dependencies [ba800163]
-   Updated dependencies [981bf48c]
-   Updated dependencies [60a18392]
-   Updated dependencies [51d6c2b9]
    -   @comet/admin@5.4.0
    -   @comet/admin-rte@5.4.0
    -   @comet/admin-date-time@5.4.0
    -   @comet/admin-icons@5.4.0
    -   @comet/admin-theme@5.4.0
    -   @comet/blocks-admin@5.4.0

## 5.3.0

### Patch Changes

-   0fdf4eaf: Always use the `/preview` file URLs in the admin application

    This is achieved by setting the `x-preview-dam-urls` in the `includeInvisibleContentContext`.

    This fixes a page copy bug where all files were downloaded and uploaded again, even when copying within the same environment.

-   Updated dependencies [0ff9b9ba]
-   Updated dependencies [0ff9b9ba]
-   Updated dependencies [a677a162]
-   Updated dependencies [60cc1b2a]
-   Updated dependencies [5435b278]
-   Updated dependencies [a2273887]
    -   @comet/admin-icons@5.3.0
    -   @comet/admin@5.3.0
    -   @comet/blocks-admin@5.3.0
    -   @comet/admin-date-time@5.3.0
    -   @comet/admin-rte@5.3.0
    -   @comet/admin-theme@5.3.0

## 5.2.0

### Minor Changes

-   0bed4e7c: Improve the `SaveConflictDialog`

    -   extend the text in the dialog to explain
        -   what happened
        -   what the next steps are
        -   what can be done to avoid conflicts
    -   make the button labels more precise
    -   once the save dialog is closed
        -   stop polling
        -   mark the save button red and with an error icon

-   0bed4e7c: `useSaveConflict()`, `useSaveConflictQuery()` and `useFormSaveConflict()` now return a `hasConflict` prop

    If `hasConflict` is true, a save conflict has been detected.
    You should pass `hasConflict` on to `SaveButton`, `FinalFormSaveButton` or `FinalFormSaveSplitButton`. The button will then display a "conflict" state.

-   0bed4e7c: Admin Generator: In the generated form, the `hasConflict` prop is passed from the `useFormSaveConflict()` hook to the `FinalFormSaveSplitButton`
-   6fda5a53: CRUD Generator: Change the file ending of the private sibling GraphQL files from `.gql.tsx` to `.gql.ts`

    The GraphQL files do not contain JSX.
    Regenerate the files to apply this change to a project.

### Patch Changes

-   Updated dependencies [25daac07]
-   Updated dependencies [0bed4e7c]
-   Updated dependencies [9fc7d474]
-   Updated dependencies [3702bb23]
-   Updated dependencies [824ea66a]
    -   @comet/admin@5.2.0
    -   @comet/admin-icons@5.2.0
    -   @comet/blocks-admin@5.2.0
    -   @comet/admin-date-time@5.2.0
    -   @comet/admin-rte@5.2.0
    -   @comet/admin-theme@5.2.0

## 5.1.0

### Patch Changes

-   e1d3f007: Prevent false positive save conflicts while editing documents (e.g. `Page`):

    -   Stop checking for conflicts while saving is in progress
    -   Ensure that all "CheckForChanges" polls are cleared

-   6d69dfac: Fix issue in PixelImageBlock that caused the preview URLs for files without a file extension in their filename to be invalid
-   21c30931: Improved the EditPageNode dialog ("Page Properties" dialog):

    -   Execute the asynchronous slug validation less often (increased the debounce wait time from 200ms to 500ms)
    -   Cache the slug validation results. Evict the cache on the initial render of the dialog

-   Updated dependencies [21c30931]
-   Updated dependencies [93b3d971]
-   Updated dependencies [e33cd652]
    -   @comet/admin@5.1.0
    -   @comet/admin-date-time@5.1.0
    -   @comet/admin-icons@5.1.0
    -   @comet/admin-rte@5.1.0
    -   @comet/admin-theme@5.1.0
    -   @comet/blocks-admin@5.1.0

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

-   9875e7d4: Support automatically importing DAM files into another scope when copying documents from one scope to another

    The copy process was reworked:

    -   The `DocumentInterface` now requires a `dependencies()` and a `replaceDependenciesInOutput()` method
    -   The `BlockInterface` now has an optional `dependencies()` and a required `replaceDependenciesInOutput()` method
    -   `rewriteInternalLinks()` was removed from `@comet/cms-admin`. Its functionality is replaced by `replaceDependenciesInOutput()`.

    `dependencies()` returns information about dependencies of a document or block (e.g. a used `DamFile` or linked `PageTreeNode`). `replaceDependenciesInOutput()` replaces the IDs of all dependencies of a document or block with new IDs (necessary for copying documents or blocks to another scope).

    You can use the new `createDocumentRootBlocksMethods()` to generate the methods for documents.

-   c3f96d7d: Don't remember the last folder or file the user opened in the DAM. The `ChooseFileDialog` still remembers the last folder opened.

### Minor Changes

-   168380d9: Add Admin CRUD Generator that creates a simple CRUD admin view for an entity

    It automatically generates an admin page, grid and form based on the GraphQL schema definition of an object type.
    It's meant to be used together with the existing API CRUD Generator.
    Go through [the commits of this PR](https://github.com/vivid-planet/comet/pull/1294/files) for a step-by-step example of how to use the API and Admin Generators.

-   8ed96981: Support copy/pasting DAM files across server instances by downloading the copied file
-   adb5bc34: Add `queryUpdatedAt()` helper that can be used to check conflicts without having to write an additional query
-   6b9787e6: It's now possible to opt-out of creating a redirect when changing the slug of a page. Previously, a redirect was always created.
-   e6b8ec60: Show a bigger version of an image when hovering over an image thumbnail in the DAM and `ChooseFileDialog`
-   5bae9ab3: Show `LinearProgress` instead of `CircularProgress` when polling after initially loading the PageTree
-   47a7272c: Add `requireLicense` option to `DamConfig` to allow making DAM license fields required (when updating a file)
-   e26bd900: Add various UI/UX improvements to the DAM

    -   Replace underlying `Table` with `DataGrid`
    -   Add paging to improve performance
    -   Add a dialog to move files to another folder (instead of drag and drop)
    -   Highlight newly uploaded files
    -   Add a new footer to execute bulk actions
    -   Add a "More Actions" dropdown above the `DataGrid` to execute bulk actions

-   a6734760: Add new `createDocumentRootBlocksMethods()` helper for creating methods needed by DocumentInterface

    It automatically adds `inputToOutput()`, `anchors()`, `dependencies()` and `replaceDependenciesInOutput()` to a document.

    You can see how it can be used [in the COMET Demo project](https://github.com/vivid-planet/comet/blob/a673476017fa35efb6361877d0fcf2b0c8231439/demo/admin/src/pages/Page.tsx#L57-L60).

-   f25eccf0: Add a hover preview for images to the DAM
-   e57c6c66: Move dashboard components from the COMET Starter to the library (`DashboardHeader`, `LatestBuildsDashboardWidget`, `LatestContentUpdatesDashboardWidget`)
-   2d0f320c: Add `useFormSaveConflict()` hook to check for save conflicts in forms

### Patch Changes

-   564f66d3: Allow `:`, `?`, `=` and `&` in redirect source paths
-   c0e03edc: Add a progress dialog to the `PageTree` when pasting pages
-   49e85432: Show a button to re-login when API responses with 401 - Not Authenticated instead of a plain error message.
-   Updated dependencies [0453c36a]
-   Updated dependencies [692c8555]
-   Updated dependencies [2559ff74]
-   Updated dependencies [fe5e0735]
-   Updated dependencies [ed692f50]
-   Updated dependencies [987f08b3]
-   Updated dependencies [d0773a1a]
-   Updated dependencies [4fe08312]
-   Updated dependencies [5f0f8e6e]
-   Updated dependencies [7c6eb68e]
-   Updated dependencies [9875e7d4]
-   Updated dependencies [d4bcab04]
-   Updated dependencies [0f2794e7]
-   Updated dependencies [80b007ae]
-   Updated dependencies [a7116784]
-   Updated dependencies [a7116784]
-   Updated dependencies [e57c6c66]
    -   @comet/admin@5.0.0
    -   @comet/admin-icons@5.0.0
    -   @comet/blocks-admin@5.0.0
    -   @comet/admin-date-time@5.0.0
    -   @comet/admin-rte@5.0.0
    -   @comet/admin-theme@5.0.0

## 4.7.0

### Minor Changes

-   dbdc0f55: Add support for non-breaking spaces to RTE

    Add `"non-breaking-space"` to `supports` when creating an RTE:

    ```tsx
    const [useRteApi] = makeRteApi();

    export default function MyRte() {
        const { editorState, setEditorState } = useRteApi();
        return (
            <Rte
                value={editorState}
                onChange={setEditorState}
                options={{
                    supports: [
                        // Non-breaking space
                        "non-breaking-space",
                        // Other options you may wish to support
                        "bold",
                        "italic",
                    ],
                }}
            />
        );
    }
    ```

-   17f977aa: Add the possibility to search for a path in PageSearch

### Patch Changes

-   Updated dependencies [d1c7a1c5]
-   Updated dependencies [dbdc0f55]
-   Updated dependencies [eac9990b]
-   Updated dependencies [fe310df8]
-   Updated dependencies [fde8e42b]
-   Updated dependencies [f48a768c]
    -   @comet/admin-theme@4.7.0
    -   @comet/admin-icons@4.7.0
    -   @comet/admin-rte@4.7.0
    -   @comet/admin@4.7.0
    -   @comet/blocks-admin@4.7.0
    -   @comet/admin-date-time@4.7.0

## 4.6.0

### Patch Changes

-   c3b7f992: Replace current icons in the RTE toolbar with new icons from `@comet/admin-icons`
-   Updated dependencies [c3b7f992]
-   Updated dependencies [c3b7f992]
-   Updated dependencies [031d86eb]
-   Updated dependencies [c3b7f992]
    -   @comet/admin-rte@4.6.0
    -   @comet/admin-icons@4.6.0
    -   @comet/blocks-admin@4.6.0
    -   @comet/admin@4.6.0
    -   @comet/admin-date-time@4.6.0
    -   @comet/admin-theme@4.6.0

## 4.5.0

### Patch Changes

-   8a2c3302: Correctly position loading indicators by centring them using the new `Loading` component
-   Updated dependencies [46cf5a8b]
-   Updated dependencies [8a2c3302]
-   Updated dependencies [6d4ca5bf]
-   Updated dependencies [07d921d2]
-   Updated dependencies [01677075]
    -   @comet/admin@4.5.0
    -   @comet/admin-theme@4.5.0
    -   @comet/admin-date-time@4.5.0
    -   @comet/admin-icons@4.5.0
    -   @comet/admin-rte@4.5.0
    -   @comet/blocks-admin@4.5.0

## 4.4.3

### Patch Changes

-   0d2a2b96: Ignore empty labels for publisher
    -   @comet/admin@4.4.3
    -   @comet/admin-date-time@4.4.3
    -   @comet/admin-icons@4.4.3
    -   @comet/admin-rte@4.4.3
    -   @comet/admin-theme@4.4.3
    -   @comet/blocks-admin@4.4.3

## 4.4.2

### Patch Changes

-   b299375f: Fix the typing of `lastUpdatedAt` in the `createUsePage()` factory
    -   @comet/admin@4.4.2
    -   @comet/admin-date-time@4.4.2
    -   @comet/admin-icons@4.4.2
    -   @comet/admin-rte@4.4.2
    -   @comet/admin-theme@4.4.2
    -   @comet/blocks-admin@4.4.2

## 4.4.1

### Patch Changes

-   Updated dependencies [662abcc9]
    -   @comet/admin@4.4.1
    -   @comet/admin-date-time@4.4.1
    -   @comet/admin-icons@4.4.1
    -   @comet/admin-rte@4.4.1
    -   @comet/admin-theme@4.4.1
    -   @comet/blocks-admin@4.4.1

## 4.4.0

### Minor Changes

-   9b1a6507: Silence polling errors in page tree

    Errors during polling (pages query, check for changes query) led to multiple consecutive error dialogs, which were irritating for our users. As these errors occurred randomly and would typically be resolved by the next poll, we decided to silence them altogether.

-   a77da844: Add little helper for mui grid pagination (muiGridPagingToGql)

    Sample usage:

    ```
    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            ...muiGridPagingToGql({ page: dataGridProps.page, pageSize: dataGridProps.pageSize }),
            sort: muiGridSortToGql(sortModel),
        },
    });
    ```

### Patch Changes

-   11583624: Add content validation for SVG files to prevent the upload of SVGs containing JavaScript
-   Updated dependencies [e824ffa6]
-   Updated dependencies [d4960b05]
-   Updated dependencies [3e15b819]
-   Updated dependencies [a77da844]
    -   @comet/admin@4.4.0
    -   @comet/blocks-admin@4.4.0
    -   @comet/admin-date-time@4.4.0
    -   @comet/admin-icons@4.4.0
    -   @comet/admin-rte@4.4.0
    -   @comet/admin-theme@4.4.0

## 4.3.0

### Minor Changes

-   afc7a6b6: Add human readable label for publisher (cron jobs and jobs)
-   c302bc46: Admin: AboutModal: make logo configurable

### Patch Changes

-   c725984f: Disable the DAM license feature per default.

    The form fields to add license information to assets are now hidden per default. License warnings are not shown per default.
    Setting the `enableLicenseFeature` option via the DamConfigProvider is now necessary to show the license fields and warnings.

-   Updated dependencies [3dc5f55a]
-   Updated dependencies [865cc5cf]
    -   @comet/admin-rte@4.3.0
    -   @comet/admin@4.3.0
    -   @comet/admin-date-time@4.3.0
    -   @comet/admin-icons@4.3.0
    -   @comet/admin-theme@4.3.0
    -   @comet/blocks-admin@4.3.0

## 4.2.0

### Minor Changes

-   7b7b786e: Add support to search values in content scope controls. Add `searchable: true` to a control's config to make it searchable. See [ContentScopeProvider](demo/admin/src/common/ContentScopeProvider.tsx) for an example

### Patch Changes

-   b4d564b6: Add spacing by default between the tabs and the tab content when using `AdminTabs` or `BlockPreviewWithTabs`. This may add unwanted additional spacing in cases where the spacing was added manually.
-   Updated dependencies [67e54a82]
-   Updated dependencies [3567533e]
-   Updated dependencies [7b614c13]
-   Updated dependencies [aaf1586c]
-   Updated dependencies [b4d564b6]
-   Updated dependencies [d25a7cbb]
-   Updated dependencies [0f4ed6c1]
    -   @comet/admin-theme@4.2.0
    -   @comet/admin@4.2.0
    -   @comet/blocks-admin@4.2.0
    -   @comet/admin-date-time@4.2.0
    -   @comet/admin-icons@4.2.0
    -   @comet/admin-rte@4.2.0

## 4.1.0

### Patch Changes

-   51466b1a: Fix DAM path display
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [51466b1a]
-   Updated dependencies [c5f2f918]
    -   @comet/admin@4.1.0
    -   @comet/admin-icons@4.1.0
    -   @comet/admin-date-time@4.1.0
    -   @comet/admin-rte@4.1.0
    -   @comet/admin-theme@4.1.0
    -   @comet/blocks-admin@4.1.0
