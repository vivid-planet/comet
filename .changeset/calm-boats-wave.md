---
"@comet/cms-admin": patch
---

Add `excludeFromGrouping` to `ContentScopeSelect`

This method allows you to exclude specific options from the grouping.
The excluded scopes are always shown on top of the scope selector.

This can be useful for scopes with optional parts like

```
interface ContentScope {
    country: string;
    company?: string;
}
```

Here you might have scopes for different companies within a country and one overview scope (`{ country: "at", company: undefined }`) that should be excluded.
