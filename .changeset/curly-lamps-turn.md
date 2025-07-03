---
"@comet/cms-admin": major
---

Rework `createRedirectsPage` usage to accept `linkBlock` instead of `customTargets`.

Previously, `customTargets` were passed directly:

```ts
const RedirectsPage = createRedirectsPage({ customTargets: { news: NewsLinkBlock }, scopeParts: ["domain"] });
```

Now, you should first create the `RedirectsLinkBlock` and then provide it to `createRedirectsPage`:

```ts
export const RedirectsLinkBlock = createRedirectsLinkBlock({
    news: NewsLinkBlock,
});

export const RedirectsPage = createRedirectsPage({ linkBlock: RedirectsLinkBlock, scopeParts: ["domain"] });
```

This change was made because `RedirectsLinkBlock` is also needed by `RedirectDependency`, and can therefore be reused.
