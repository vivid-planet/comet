---
"@comet/cms-api": patch
---

Always use preview DAM URLs in the admin application

This fixes a bug where the PDF preview in the DAM wouldn't work because the file couldn't be included in an iFrame on the admin domain.

We already intended to use preview URLs everywhere in [v5.3.0](https://github.com/vivid-planet/comet/releases/tag/v5.3.0#:~:text=Always%20use%20the%20/preview%20file%20URLs%20in%20the%20admin%20application). However, the `x-preview-dam-urls` header wasn't passed correctly to the `createFileUrl()` method everywhere. As a result, preview URLs were only used in blocks but not in the DAM. Now, the DAM uses preview URLs as well. 
