---
"@comet/cms-api": minor
---

File Uploads: Add option to disable the GraphQL field resolvers

Use this when using file uploads without GraphQL.

```ts
FileUploadsModule.register({
    /* ... */
    download: {
        /* ... */
        createFieldResolvers: false,
    },
});
```
