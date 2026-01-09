---
"@comet/cms-admin": minor
---

Improve `InfoTag` type in `DocumentType`

Add a new `InfoTagProps` type that can be used to properly type additional page tree node fields:

```tsx
const Page: DocumentInterface = {
    InfoTag: ({ page }: InfoTagProps<{ userGroup: GQLUserGroup }>) => {
        // page now has the userGroup field
        if (page.userGroup !== "all") {
            return <Chip size="small" label={page.userGroup} />;
        }
        return null;
    },
};
```
