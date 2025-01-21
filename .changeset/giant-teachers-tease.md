---
"@comet/cms-api": major
---

Merge `@comet/blocks-api` into `@comet/cms-api`

The dedicated `@comet/blocks-api` package was originally introduced to support projects without CMS parts.
It turned out that this is never the case, so the separation doesn't make sense anymore.
Therefore, the `@comet/blocks-api` is merged into this package.

**Breaking changes**

- The `@comet/blocks-api` package doesn't exist anymore
- The `getFieldKeys` function has been removed from the public API
- Multiple exports that were too generic have been renamed
    - `getMostSignificantPreviewImageUrlTemplate` -> `getMostSignificantPreviewImageUrlTemplateFromBlock`
    - `getPreviewImageUrlTemplates` -> `getPreviewImageUrlTemplatesFromBlock`
    - `getSearchText` -> `getSearchTextFromBlock`
    - `inputToData` -> `blockInputToData`
    - `TransformResponse` -> `TransformBlockResponse`
    - `TransformResponseArray` -> `TransformBlockResponseArray`
    - `transformToSave` -> `transformToBlockSave`
    - `transformToSaveIndex` -> `transformToBlockSaveIndex`
    - `TraversableTransformResponse` -> `TraversableTransformBlockResponse`
    - `TraversableTransformResponseArray` -> `TraversableTransformBlockResponseArray`
    - `typesafeMigrationPipe` -> `typeSafeBlockMigrationPipe`

**How to upgrade**

To upgrade, perform the following changes:

1. Uninstall the `@comet/blocks-api` package
2. Update all your imports from `@comet/blocks-api` to `@comet/cms-api`
3. Remove usages of `getFieldKeys` (probably none)
4. Update imports that have been renamed
