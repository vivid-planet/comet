---
"@comet/cms-admin": major
---

Merge `@comet/blocks-admin` into `@comet/cms-admin`

The dedicated `@comet/blocks-admin` package was originally introduced to support projects without CMS parts.
It turned out that this is never the case, so the separation doesn't make sense anymore.
Therefore, the `@comet/blocks-admin` is merged into this package.

**Breaking changes**

- The `@comet/blocks-admin` package doesn't exist anymore
- Multiple exports that shouldn't be used have been removed from the public API
    - `CannotPasteBlockDialog`
    - `ClipboardContent`
    - `useBlockClipboard`
    - `Collapsible`
    - `CollapsibleSwitchButtonHeader`
    - `usePromise`
    - `DispatchSetStateAction` (use `Dispatch<SetStateAction<T>>` from `react` instead)
    - `SetStateAction`
    - `SetStateFn`
- Multiple exports that were too generic have been renamed
    - `createCompositeSetting` -> `createCompositeBlockField`
    - `createCompositeSettings` -> `createCompositeBlockFields`
    - `IPreviewContext` -> `BlockPreviewContext`
    - `PreviewStateInterface` -> `BlockPreviewStateInterface`
    - `AdminComponentPart` -> `BlockAdminComponentPart`
    - `AdminComponentButton`-> `BlockAdminComponentButton`
    - `AdminComponentNestedButton`-> `BlockAdminComponentNestedButton`
    - `AdminComponentPaper`->`BlockAdminComponentPaper`
    - `useAdminComponentPaper`-> `useBlockAdminComponentPaper`
    - `AdminComponentRoot`-> `BlockAdminComponentRoot`
    - `AdminComponentSection`-> `BlockAdminComponentSection`
    - `AdminComponentSectionGroup`-> `BlockAdminComponentSectionGroup`
    - `AdminTabLabel`-> `BlockAdminTabLabel`
    - `AdminTabsProps`-> `BlockAdminTabsProps`
    - `AdminTabs`-> `BlockAdminTabs`

**How to upgrade**

To upgrade, perform the following changes:

1. Uninstall the `@comet/blocks-admin` package
2. Update all your imports from `@comet/blocks-admin` to `@comet/cms-admin`
3. Remove usages of removed exports
4. Update imports that have been renamed
