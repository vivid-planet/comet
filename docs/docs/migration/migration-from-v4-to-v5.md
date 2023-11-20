---
title: Migration from v4 to v5
sidebar_position: 1
---

# Migration Guide

## API

### DAM Scoping

DAM scoping can be enabled optionally. You can still use the DAM without scoping.

To enable DAM scoping, you must

In the API:

-   Create a DAM folder entity using `createFolderEntity({ Scope: DamScope });`
-   Create a DAM file entity using `createFileEntity({ Scope: DamScope, Folder: DamFolder });`
-   Pass the `Scope` DTO and the `File` and `Folder` entities when intializing the `DamModule`

(see Admin section for Admin instructions)

See the [Demo project](https://github.com/vivid-planet/comet/pull/976) for an example on how to enable DAM scoping.

#### FilesService.upload()

The method signature changed. The second argument is now an options object containing a `scope` field.

**Before**

```ts
await filesService.upload(file, folderId);
```

**After**

```ts
await filesService.upload(file, { folderId, scope });
```

### Dependencies

Add the new `DependenciesModule` to your `AppModule`.

#### indexData()

Previously, `BlockIndexData` had one field: `damFileIds`. It could only represent dependencies to DAM files. Now, `BlockIndexData` has a generic `dependencies` field. It can represent dependencies to any entity.

The `indexData()` method of a block must be refactored from

```ts
indexData(): BlockIndexData {
    return {
        damFileIds: this.damFileId ? [this.damFileId] : [],
    };
}
```

to

```ts
indexData(): BlockIndexData {
    if (this.damFileId === undefined) {
        return {};
    }

    return {
        dependencies: [
            {
                targetEntityName: File.name,
                id: this.damFileId,
            },
        ],
    };
}
```

#### DiscoverService

If you use the `DiscoverService` in your application, you now need to import the `DependenciesModule` (instead of the `BlocksModule`).

#### BlockIndexService -> DependenciesService

The `BlockIndexService` was renamed to `DependenciesService`.

### blocks-meta.json

The key (type) of OneOfBlocks is now included in the `blocks-meta.json`.

This is only a problem if you still have your own `generate-block-types.ts` in your project. In that case, you must switch to `@comet/cli`:

-   Install `@comet/cli` as a dev dependency
-   Replace the scripts in the package.json of your admin:

    ```json
        "generate-block-types": "comet generate-block-types --inputs",
        "generate-block-types:watch": "chokidar -s \"**/block-meta.json\" -c \"npm run generate-block-types\""
    ```

-   Replace the scripts in the package.json of your site:

    ```json
        "generate-block-types": "comet generate-block-types",
        "generate-block-types:watch": "chokidar -s \"**/block-meta.json\" -c \"npm run generate-block-types\"",
    ```

### @IsOptional() -> @IsUndefinable() and @IsNull()

`class-validator` offers the `@IsOptional()` decorator. `@IsOptional()` allows `undefined` and `null` which can lead to bugs in some cases.

Thus, COMET now offers the more specific `@IsUndefinable()` and `@IsNull()` decorators. Use these decorators from now on and (if possible) replace existing `@IsOptional()` with `@IsUndefinable()` or `@IsNull()`.

### PartialType

COMET now has an own implementation of `PartialType` using `@IsUndefinable()` (instead of `@IsOptional()`). Uses of `PartialType` from `@nestjs/mapped-types` should be replaced with `PartialType` from `@comet/cms-api`.

### PageTreeNode

`PageTreeNode` now has an `updatedAt` column.

The `updatedAt` timestamp is set to the current time when the migration is executed.
If you want the timestamp to reflect the `updatedAt` timestamp of the active attached document, you need to write an additional migration for that.

### SkipBuildInterceptor

The `SkipBuildInterceptor` was removed. If you want to skip a build for an operation, use the `@SkipBuild()` decorator instead.


## Admin

### Admin Generator

Add the following command to the `package.json` of your admin app:

```json
 "admin-generator": "rimraf 'src/*/generated' && comet-admin-generator generate crud-generator-config.ts",
```

### DAM Scoping

DAM scoping can be enabled optionally. You can still use the DAM without scoping.

To enable DAM scoping, you must

-   Set `scopeParts` in the `DamConfigProvider` (e.g. `<DamConfigProvider value={{ scopeParts: ["domain"] }}>`)
-   Render the content scope indicator in the `DamPage`

    ```tsx
    <DamPage renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} />} />
    ```

You can access the current DAM scope in the Admin using the `useDamScope()` hook.

(see API section for API instructions)

See the [Demo project](https://github.com/vivid-planet/comet/pull/976) for an example on how to enable DAM scoping.

### Documents (DocumentInterface)

The `DocumentInterface` now requires a `dependencies()` and a `replaceDependenciesInOutput()` method. However, you don't have to implement them yourself.

**Instead, use the new `createDocumentRootBlocksMethods()` to generate the methods.**
It further generates `anchors()` and `inputToOutput()`.

```tsx
export const Page: DocumentInterface<Pick<GQLPage, "content" | "seo">, GQLPageInput> = {
    // ...
    ...createDocumentRootBlocksMethods({
        content: PageContentBlock,
        seo: SeoBlock,
    }),
};
```

### Blocks (BlockInterface)

The `BlockInterface` now has the methods `dependencies()` and  `replaceDependenciesInOutput()`.

If your block has a dependency to some entity (e.g. a link to a `PageTreeNode` or uses a `DamFile`), you should implement both methods. `dependencies()` returns the dependency information for the block. It could look like this:

```tsx
dependencies: (state) => {
    const dependencies: BlockDependency[] = [];

    if (state.damFile?.id) {
        dependencies.push({
            targetGraphqlObjectType: "DamFile",
            id: state.damFile.id,
            data: {
                damFile: state.damFile,
            },
        });
    }

    return dependencies;
},
```

`replaceDependenciesInOutput()` replaces the IDs of your dependencies when copying the block to another scope:

```tsx
replaceDependenciesInOutput: (output, replacements) => {
    const clonedOutput: PixelImageBlockInput = deepClone(output);
    const replacement = replacements.find((replacement) => replacement.type === "DamFile" && replacement.originalId === output.damFileId);

    if (replacement) {
        clonedOutput.damFileId = replacement.replaceWithId;
    }

    return clonedOutput;
},
```

### BlockPreview

The `BlockPreview` component was removed. Instead, use `BlockPreviewContent`:

**Before:**

```tsx
const state = linkBlock.input2State(params.value);

return (
    <BlockPreview
        title={linkBlock.dynamicDisplayName?.(state) ?? linkBlock.displayName}
        content={linkBlock.previewContent(state)}
    />
);
```

**After:**

```tsx
return (
    <BlockPreviewContent block={linkBlock} input={params.value} />
);
```

### @comet/admin

#### Loading

The `Loading` component now uses our `BallTriangle` instead of MUI's `CircularProgress`. If you use the `size` prop, you must now use `sx` instead:

```diff
- <Loading behavior="fillParent" size={20} color="inherit" />
+ <Loading behavior="fillParent" sx={{ fontSize: 20 }} color="inherit" />
```

#### FinalFormSelect

The `getOptionSelected()` prop was removed from `FinalFormSelect` and replaced with `getOptionValue()` in order to support multi-select.

If you had a custom implementation of `getOptionSelected()`, you may need to replace it with a custom `getOptionValue()`. However, for most cases the [default implementation](https://github.com/vivid-planet/comet/commit/fe5e0735#diff-ef93179fe4c6d99e9e776fb1e928ac8b5af12c27fa2d2a6ea124e46028fb8b95R28-R31) will be sufficient.

#### FilterBarMoreFilters

The classes of `FilterBarMoreFilters` have changed.

The "More Filter" text is now [wrapped in a `FilterBarButton`](https://github.com/vivid-planet/comet/commit/d0773a1a#diff-1d3c17943c3e5bfbceba204bf3dd787d051b994c286f2bd9c2cbc462530568fdR27-R31). In the process, the `textWrapper` class was removed. Now you must use the `button` class instead.

#### Dirty Handling

When a user makes changes in a form and then navigates away without saving (e.g. by closing the dialog or leaving the page), a dialog is displayed asking them "Do you want to save your changes?". This is called dirty handling.

Previously, we used the custom implemented `DirtyHandler` to do this. Now, we use `RouterPrompt`, which is based on `react-router`.

Most applications only use dirty handling indirectly since it's built into `FinalForm`, `Stack` and `EditDialog`. If your application doesn't use the `DirtyHandler` directly, you don't need to do anything.

If you use the `DirtyHandler`, you need to migrate to the new system. Take a look at [this PR](https://github.com/vivid-planet/comet/pull/1027) and especially at `FinalForm.tsx`, `Stack.tsx` and `EditDialog.tsx` to get an idea of how to do this.


## Site

There were no breaking changes to `@comet/cms-site`. It should work out of the box.


## Eslint

### no-private-sibling-import

The new rule `no-private-sibling-import` bans imports of private sibling files. A sibling file is, for example, a `Foo.gql.ts` file next to a `Foo.ts` file. `Foo.gql.ts` is considered a private sibling of `Foo.ts` and must not be used (imported) by any other file.
