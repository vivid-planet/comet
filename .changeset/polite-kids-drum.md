---
"@comet/cms-api": minor
---

File Uploads: Add download endpoint

The endpoint can be enabled by providing the `download` option in the module config:

```ts
FileUploadsModule.register({
  /* ... */,
  download: {
    secret: "your secret",
  },
})
```
