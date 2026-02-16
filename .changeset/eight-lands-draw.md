---
"@comet/cli": minor
---

Support 1Password references in site configs

Allows referencing secrets stored in 1Password directly in the site config using the `{{ op://... }}` syntax. For example:

```ts site-configs/your-site.ts
export default ((env) => {
    return {
        // ,,,
        apiKey: `{{ op://example-project-prod/api-key/password }}`,
    };
}) satisfies GetSiteConfig;
```

They are then replaced with the actual values by `inject-site-configs`.
