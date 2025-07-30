---
"@comet/cms-admin": major
---

Remove passed `scopeParts` from `createRedirectsPage`

Add optional `redirectsConfig` to `CometConfigProvider` instead.

**Example**

```diff
- export const RedirectsPage = createRedirectsPage({ linkBlock: RedirectsLinkBlock, scopeParts: ["domain"]})
+ export const RedirectsPage = createRedirectsPage({ linkBlock: RedirectsLinkBlock });
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
