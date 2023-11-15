---
"@comet/cms-api": major
---

Change `FilesService.upload` method signature

The method now accepts an options object as first argument, and a second `scope` argument.

**Before**

```ts
await filesService.upload(file, folderId);
```

**After**

```ts
await filesService.upload({ file, folderId }, scope);
```
