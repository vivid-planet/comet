---
title: Migrating from v4 to v5
sidebar_position: -5
---

# Migrating from v4 to v5

## API

### DependenciesModule

Add the `DependenciesModule` to `AppModule`:

```diff
import {
    ...
+   DependenciesModule,
} from "@comet/cms-api";

...

@Module({})
export class AppModule {
    static forRoot(config: Config): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot(config),
                DbModule,
                ...
+               DependenciesModule,
            ],
        };
    }
}
```

### blocks-meta.json

The key (type) of OneOfBlocks is now included in the `blocks-meta.json`.

This is only a problem if you still have your own `generate-block-types.ts` in your project. In that case, you must switch to `@comet/cli`:

1. Install `@comet/cli` as a dev dependency
2. Replace the scripts in the package.json of your admin:

    ```diff
    - "generate-block-types": "dotenv -c -- ts-node generate-block-types.ts",
    + "generate-block-types": "comet generate-block-types --inputs",
    ```

3. Replace the scripts in the package.json of your site:

    ```diff
    - "generate-block-types": "dotenv -c -- ts-node generate-block-types.ts",
    + "generate-block-types": "comet generate-block-types",
    ```

### indexData()

Previously, `BlockIndexData` had one field: `damFileIds`. It could only represent dependencies to DAM files. Now, `BlockIndexData` has a generic `dependencies` field. It can represent dependencies to any entity.

The `indexData()` method of a block must be refactored

```diff
indexData(): BlockIndexData {
-    return {
-        damFileIds: this.damFileId ? [this.damFileId] : [],
-    };
+    if (this.damFileId === undefined) {
+        return {};
+    }
+
+    return {
+        dependencies: [
+            {
+                targetEntityName: File.name,
+                id: this.damFileId,
+            },
+        ],
+    };
}
```

### File and Folder Entities

`File` and `Folder` are no longer exported by `@comet/cms-api`. Instead, use the exported `FileInterface` and `FolderInterface` for typing.

If you need classes (e.g. as return type of a GraphQL field), you can create them using the `createFileEntity()` and `createFolderEntity()` factories.
You will then need to pass your classes to the `DamModule` during initialization:

```diff
DamModule.register({
   // ...
+  File: DamFile,
+  Folder: DamFolder,
})
```

### FilesService.upload()

The method signature changed.
The second argument is now an options object.
You may have to adjust this in your fixtures.

```diff
- await filesService.upload(file, folderId);
+ await filesService.upload(file, { folderId });
```

### @IsOptional() -> @IsUndefinable() and @IsNullable()

`class-validator` offers the `@IsOptional()` decorator that allows `undefined` and `null`.
COMET now offers the more specific `@IsUndefinable()` and `@IsNullable()` decorators to avoid bugs.
Use these decorators from now on and (if possible) replace existing `@IsOptional()` with `@IsUndefinable()` or `@IsNullable()`.

### PartialType

COMET now has an own implementation of `PartialType` using `@IsUndefinable()` (instead of `@IsOptional()`).
Uses of `PartialType` from `@nestjs/mapped-types` should be replaced with `PartialType` from `@comet/cms-api`.

## Admin

### Admin Generator

Add the following command to the `package.json` of your admin app:

```diff
+ "admin-generator": "rimraf 'src/*/generated' && comet-admin-generator generate crud-generator-config.ts",
```

### Documents (DocumentInterface)

The `DocumentInterface` now requires a `dependencies()` and a `replaceDependenciesInOutput()` method. However, you don't have to implement them yourself.

**Instead, use the new `createDocumentRootBlocksMethods()` to generate the methods.**
It further generates `anchors()` and `inputToOutput()`.

```diff
export const Page: DocumentInterface<Pick<GQLPage, "content" | "seo">, GQLPageInput> = {
    // ...
-   inputToOutput: (input) => {},
-   anchors: (input) => {},
+   ...createDocumentRootBlocksMethods({
+       content: PageContentBlock,
+       seo: SeoBlock,
+   }),
};
```

### Blocks (BlockInterface)

The `BlockInterface` now has the methods `dependencies()` and `replaceDependenciesInOutput()`.
However, you usually don't have to implement them. Only if your block has dependencies to some entity (e.g. a link to a `PageTreeNode` or uses a `DamFile`).

`dependencies()` returns the dependency information for the block. It could look like this:

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
};
```

`replaceDependenciesInOutput()` replaces the IDs of your dependencies when copying the block to another scope:

```tsx
replaceDependenciesInOutput: (output, replacements) => {
    const clonedOutput: PixelImageBlockInput = deepClone(output);
    const replacement = replacements.find(
        (replacement) =>
            replacement.type === "DamFile" && replacement.originalId === output.damFileId,
    );

    if (replacement) {
        clonedOutput.damFileId = replacement.replaceWithId;
    }

    return clonedOutput;
};
```

### Dashboard

New components `DashboardHeader`, `LatestBuildsDashboardWidget`, and `LatestContentUpdatesDashboardWidget` have been added to replace existing components defined in application code.
See [this PR](https://github.com/vivid-planet/comet-starter/pull/40) for an example on how to migrate.

### BlockPreview

The `BlockPreview` component was removed. Instead, use `BlockPreviewContent`:

```diff
- const state = linkBlock.input2State(params.value);

- return <BlockPreview title={linkBlock.dynamicDisplayName?.(state) ?? linkBlock.displayName} content={linkBlock.previewContent(state)} />;
+ return <BlockPreviewContent block={linkBlock} input={params.value} />;
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

The `textWrapper` class of `FilterBarMoreFilters` was removed. Use the new `button` class instead.

## Site

### Restricted imports

The imports for `Link`, `useRouter`, and `Image` from `next` have been restricted.
Please use `Link`, `useRouter` and `Image` from `@comet/cms-site` instead.

```diff
- import Link from "next/link";
+ import { Link } from "@comet/cms-site";

- import { useRouter } from "next/router";
+ import { useRouter } from "@comet/cms-site";

- import Image from "next/image";
+ import { Image } from "@comet/cms-site";
```

## ESLint

### no-private-sibling-import

The new rule `no-private-sibling-import` bans imports of private sibling files.
Meaning, a file called `Foo.gql.ts` next to a `Foo.ts` can only be imported by `Foo.ts` and no other file.
