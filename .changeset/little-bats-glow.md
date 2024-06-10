---
"@comet/cms-admin": minor
---

The `documentTypes` prop of `PagesPage` now also accepts a function mapping categories to document types

Previously, only the supported documentTypes of the current category could be passed to the `PagesPage`.
That made it impossible to verify if a document can be moved to another category.
If a document was moved to a category that didn't support its type, the PageTree crashed.

If a mapping function is passed to `documentTypes`, documents can only be moved to categories that support their type.

```diff
<PagesPage
-   documentTypes={pageTreeDocumentTypes}
+   documentTypes={(category): Record<DocumentType, DocumentInterface> => {
+       if (category === "TopMenu") {
+           return {
+               Page,
+               PredefinedPage,
+           };
+       }
+
+       return {
+           Page,
+           PredefinedPage,
+           Link,
+       };
+   }}
    // ...
/>
```
