---
"@comet/cms-admin": minor
---

Add `categoryToDocumentTypesMap` to `PagesPage`

Previously, only the supported documentTypes of the current category were passed to the `PagesPage`.
That made it impossible to verify if a document can be moved to another category.
If a document was moved to a category that didn't support its type, the PageTree crashed.

If `categoryToDocumentTypesMap` is set, documents can now only be moved to categories that support their type.

```diff
<PagesPage
-   documentTypes={pageTreeDocumentTypes}
+   categoryToDocumentTypesMap={{
+       MainNavigation: {
+           Page,
+           Link,
+           PredefinedPage,
+       },
+       TopMenu: {
+           Page,
+           PredefinedPage,
+       },
+   }}
    // ...
/>
```
