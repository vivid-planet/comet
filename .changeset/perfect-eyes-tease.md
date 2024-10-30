---
"@comet/cms-admin": minor
---

Add support for multiple paths in `ContentScopeProvider`

This enables using different paths for scopes with non-overlapping dimensions.
The `location.createPath` and `location.createUrl` functions can be used to override the default behavior.

**Example**

```tsx
<ContentScopeProvider
    location={{
        createPath: () => ["/organization/:organizationId", "/channel/:channelId"],
        createUrl: (scope) => {
            if (scope.organizationId) {
                return `/organization/${scope.organizationId}`;
            } else if (scope.channelId) {
                return `/channel/${scope.channelId}`;
            } else {
                throw new Error("Invalid scope");
            }
        },
    }}
/>
```
