# @comet/cms-admin

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
