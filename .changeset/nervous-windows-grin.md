---
"@comet/cms-admin": major
"@comet/blocks-api": major
"@comet/cms-api": major
---

Remove unused/unnecessary peer dependencies

Some dependencies were incorrectly marked as peer dependencies.
If you don't use them in your application, you may remove the following dependencies:

-   Admin: `axios`
-   API: `@aws-sdk/client-s3`, `@azure/storage-blob` and `pg-error-constants`
