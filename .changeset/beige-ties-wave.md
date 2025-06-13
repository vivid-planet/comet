---
"@comet/cms-admin": minor
---

Page Tree: Add support for scope parts

**Example**

```tsx
<CmsBlockContextProvider
    // Dimension "domain" is used for the page tree scope
    pageTreeScopeParts={["domain"]}
>
    {/* ... */}
</CmsBlockContextProvider>
```
