# @comet/blocks-api

## 5.0.0

### Major Changes

-   c10a86c6: Change blocks-meta.json format: the key (type) for OneOfBlocks is now included

    Projects that still have a copy of generate-block-types should switch to @comet/cli

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
