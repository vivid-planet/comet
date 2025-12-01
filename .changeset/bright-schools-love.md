---
"@comet/cms-api": patch
---

Fix FileUploadModule: The `setInterval` for cleaning expired files was blocking application bootstrap. Moved interval initialization to the NestJS lifecycle hook `onApplicationBootstrap` and added cleanup in `beforeApplicationShutdown` to properly clear the interval.
