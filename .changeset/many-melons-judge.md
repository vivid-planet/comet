---
"@comet/cms-admin": patch
---


Always use the `/preview` file URLs in the admin application

This is achieved by setting the `x-preview-dam-urls` in the `includeInvisibleContentContext`.

This fixes a page copy bug where all files were downloaded and uploaded again, even when copying within the same environment.
