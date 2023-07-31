# @comet/cms-admin

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
