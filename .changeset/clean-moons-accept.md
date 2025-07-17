---
"@comet/cms-admin": minor
---

Add optional `scopePartsForRedirects` to `pageTreeConfig` to check for existing redirects per scope when changing a page's slug

**Example**

```tsx
 export function App() {
    return (
        <CometConfigProvider
            //...
            pageTree={{
                //...
+               scopePartsForRedirects: ["domain"],
            }}
            //...
        >
        )
    }
```

When editing a page and changing its slug, the form now checks if a redirect for the old path already exists (using the configured `scopePartsForRedirects`). If a redirect exists, the option to create an automatic redirect is disabled.
