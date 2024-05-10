---
"@comet/cms-admin": minor
---

Allow disabling the "Open preview" button in the `PageTree` for certain document types

The "Open preview" button is shown for all document types in the `PageTree`.
But some document types (e.g., links) don't have a preview.
Clicking on the preview button leads to an error page.

Now, it's possible to disable the button by setting `hasNoPreview` for the document:

```diff
export const Link: DocumentInterface<Pick<GQLLink, "content">, GQLLinkInput> = {
    // ...
+   hasNoPreview: true,
};
```
