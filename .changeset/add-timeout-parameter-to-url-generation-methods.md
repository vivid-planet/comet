---
"@comet/cms-api": minor
---

Add optional timeout parameter to file upload URL generation methods

The `createDownloadUrl`, `createImageUrl`, and `createPreviewUrl` methods now accept an optional `urlTimeoutHours` parameter to customize the URL expiration timeout.

**Example**

```typescript
// Default 1-hour timeout (backward compatible)
const downloadUrl = fileUploadsService.createDownloadUrl(fileUpload);

// Custom 24-hour timeout
const downloadUrl = fileUploadsService.createDownloadUrl(fileUpload, 24);
const imageUrl = fileUploadsService.createImageUrl(fileUpload, 200, 24);
const previewUrl = fileUploadsService.createPreviewUrl(fileUpload, 24);
```
