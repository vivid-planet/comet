---
"@comet/blocks-api": major
---

Change the structure of `BlockIndexData` to make it generic

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