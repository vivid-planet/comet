---
"@comet/cms-admin": minor
---

Add search results highlighting to `ContentScopeSelect`

Add helper function `findTextMatches`to `"@comet/cms-admin"`
This helper can be used to add Search Highlighting to Custom render options:

```
renderOption={(option, query) => {
    const text =`${option.domain.label} – ${option.language.label}`;
    const matches = findTextMatches(text, query);
    return <ListItemText primary={<MarkedMatches text={text} matches={matches} />} />;
}}
```
