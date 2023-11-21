# @comet/cms-admin

## 5.0.0

### Major Changes

-   9875e7d4: Support automatically importing DAM files into another scope when copying documents from one scope to another

    The copy process was reworked:

    -   The `DocumentInterface` now requires a `dependencies()` and a `replaceDependenciesInOutput()` method
    -   The `BlockInterface` now has an optional `dependencies()` and a required `replaceDependenciesInOutput()` method
    -   `rewriteInternalLinks()` was removed from `@comet/cms-admin`. Its functionality is replaced by `replaceDependenciesInOutput()`.

    `dependencies()` returns information about dependencies of a document or block (e.g. a used `DamFile` or linked `PageTreeNode`). `replaceDependenciesInOutput()` replaces the IDs of all dependencies of a document or block with new IDs (necessary for copying documents or blocks to another scope).

    You can use the new `createDocumentRootBlocksMethods()` to generate the methods for documents.

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

-   c3f96d7d: Don't remember the last folder or file the user opened in the DAM. The `ChooseFileDialog` still remembers the last folder opened.

### Minor Changes

-   adb5bc34: Add queryUpdatedAt helper that can be used in checkConflict without having the write an addtional query
-   6b9787e6: It's now possible to opt-out of creating a redirect when changing the slug of a page

    Previously, a redirect was always created.

-   e6b8ec60: Show a bigger version of an image when hovering over an image thumbnail in the DAM and asset picker dialog
-   47a7272c: Add `requireLicense` option to `DamConfig` to allow making DAM license fields required
-   5bae9ab3: Show LinearProgress instead of CircularProgress when polling after initially loading the page tree
-   e26bd900: Add various DAM UI/UX improvements

    -   Replace underlying `Table` with `DataGrid`
    -   Add paging to improve performance
    -   Add a dialog to move files to another folder (instead of Drag and Drop)
    -   Highlight newly uploaded files
    -   Add a new footer to execute bulk actions
    -   Add a "More Actions" dropdown above the `DataGrid` to execute bulk actions

-   8ed96981: Support Copy-Paste with DAM files across server instances by downloading the copied file
-   168380d9: Add Admin CRUD generator that creates a simple CRUD admin view for a entity
-   a6734760: Add new createDocumentRootBlocksMethods helper for creating methods needed by DocumentInterface
-   f25eccf0: Add a hover preview for images to the DAM
-   7c6eb68e: Add `useFormSaveConflict()` hook to check for save conflicts in forms
-   e57c6c66: Add dashboard components to cms-admin (header, latest-builds widget, latest-content-updates widget)

### Patch Changes

-   564f66d3: Allow `:`, `?`, `=` and `&` in redirect source paths
-   c0e03edc: Page Tree: add progress Dialog when pasting pages
-   49e85432: When API responses with Not Authenticated the Admin now shows a button to re-login instead of a plain error message.
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
