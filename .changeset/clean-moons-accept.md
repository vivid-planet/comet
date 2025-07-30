---
"@comet/cms-admin": minor
---

Remove passed `scopeParts` from `createRedirectsPage`

Add optional `redirectsConfig` to `CometConfigProvider` instead.

**Example**

```tsx
export const RedirectsPage = createRedirectsPage({ linkBlock: RedirectsLinkBlock });
```

```tsx
<CometConfigProvider
    //...
    redirects={{
        scopeParts: ["domain"],
    }}
    //...
>
    {/* Application */}
</CometConfigProvider>
```
