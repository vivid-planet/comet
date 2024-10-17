---
"@comet/cms-admin": minor
---

Add search results highlighting to `ContentScopeSelect`

Also, add the helper function `findTextMatches`, which can be used to add search highlighting to a custom `renderOption` implementation:

```tsx
<ContentScopeSelect
    renderOption={(option, query) => {
        const text = `${option.domain.label} – ${option.language.label}`;
        const matches = findTextMatches(text, query);
        return <ListItemText primary={<MarkedMatches text={text} matches={matches} />} />;
    }}
/>
```
