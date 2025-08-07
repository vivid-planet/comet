---
"@comet/cms-admin": patch
---

Copying a page between scopes with the same DAM scope now retains DAM file references

Previously, when copying a page from one scope to another and these scopes shared the same DAM scope, the copied page would lose all references to DAM files.

Example:

-   You copy a page from scope `{ domain: "main", language: "en" }` to `{ domain: "main", language: "de" }`
-   And the DAM scope is only `{ domain: "main" }`

→ the copied page would lose all references to DAM files

Now, the copied page retains references to DAM files, if both scopes share the same DAM scope.
