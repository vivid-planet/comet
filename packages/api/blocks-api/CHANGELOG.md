# @comet/blocks-api

## 6.2.1

## 6.2.0

### Minor Changes

-   75865caa: Deprecate `isHref` validator, `IsHref` decorator and `IsHrefConstraint` class.

    New versions `isLinkTarget`, `IsLinkTarget` and `IsLinkTargetConstraint` are added as replacement.

## 6.1.0

## 6.0.0

## 5.6.0

### Minor Changes

-   fd10b801: Add support for a custom block name and migrations to `createRichTextBlock`

## 5.5.0

## 5.4.0

## 5.3.0

### Minor Changes

-   920f2b85: Deprecate `nullable: true` for child blocks

    Nullable child blocks are not correctly supported in the Admin, for instance, in `createCompositeBlock`.
    Save a block's default values instead.

## 5.2.0

## 5.1.0

## 5.0.0

### Major Changes

-   c10a86c6: Change blocks-meta.json format: the key (type) for OneOfBlocks is now included

    Projects that still have a copy of `generate-block-types.ts` should switch to `@comet/cli`:

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

-   c91906d2: Change the structure of `BlockIndexData` to make it generic

    Previously, `BlockIndexData` had one field: `damFileIds`. It could only represent dependencies to DAM files.

    Now, `BlockIndexData` has a generic `dependencies` field. It can represent dependencies to any entity.

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

## 4.7.0

## 4.6.0

## 4.5.0

## 4.4.3

## 4.4.2

## 4.4.1

## 4.4.0

### Minor Changes

-   d4960b05: Add loop toggle to YouTubeVideo block

## 4.3.0

## 4.2.0

## 4.1.0
