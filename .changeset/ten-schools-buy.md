---
"@comet/cms-admin": patch
---

Make headers in `includeInvisibleContentContext` overridable in query

You can now override the headers `x-include-invisible-content` and `x-preview-dam-urls` in your query like this:

```tsx
const { loading, data, error } = useQuery(exampleQuery, {
    // ...
    context: {
        headers: {
            "x-include-invisible-content": [],
            "x-preview-dam-urls": 0,
        },
    },
});
```
