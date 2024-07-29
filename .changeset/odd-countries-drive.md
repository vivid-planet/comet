---
"@comet/cms-api": major
---

Secure file uploads upload endpoint by default

The `/file-uploads/upload` endpoint now requires the `fileUploads` permission by default.

Use the `upload.public` option to make the endpoint public:

```diff
FileUploadsModule.register({
    /* ... */,
+   upload: {
+       public: true,
+   },
}),
```
