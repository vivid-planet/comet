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
    allowedImageSizes: [16, 32, 48, /* your allowed image sizes */]
  },
})
```
