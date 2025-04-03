---
"@comet/cms-admin": major
---

Change type of the `values` prop of ContentScopeProvider

**Before**

```ts
const values: ContentScopeValues<ContentScope> = [
    {
        domain: { label: "Main", value: "main" },
        language: { label: "English", value: "en" },
    },
    {
        domain: { label: "Main", value: "main" },
        language: { label: "German", value: "de" },
    },
    {
        domain: { label: "Secondary", value: "secondary" },
        language: { label: "English", value: "en" },
    },
];
```

**Now**

```ts
const values: ContentScopeValues<ContentScope> = [
    {
        scope: { domain: "main", language: "en" },
        label: { domain: "Main", language: "English" },
    },
    {
        scope: { domain: "main", language: "de" },
        label: { domain: "Main", language: "German" },
    },
    {
        scope: { domain: "secondary", language: "en" },
        label: { domain: "Secondary", language: "English" },
    },
];
```
