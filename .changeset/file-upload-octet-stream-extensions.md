---
"@comet/cms-api": minor
---

Support accepting files uploaded with the generic `application/octet-stream` mime type based on their file extension

Some browsers upload certain files (e.g. `.msg`, `.eml`) with the generic `application/octet-stream` mime type instead of their specific one, which caused them to be rejected during upload validation even when their specific mime type was part of `acceptedMimeTypes`.

Add the new `acceptedFileExtensionsForOctetStream` option (available for both the DAM and file uploads config) to accept such files based on their file extension. The extension's specific mime type must still be included in `acceptedMimeTypes`; arbitrary `application/octet-stream` uploads (e.g. executables) remain rejected.

**Example**

```ts
DamModule.register({
    // ...
    acceptedMimeTypes: [...damDefaultAcceptedMimetypes, "application/vnd.ms-outlook", "message/rfc822"],
    acceptedFileExtensionsForOctetStream: ["msg", "eml"],
});
```
