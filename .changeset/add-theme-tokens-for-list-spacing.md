---
"@comet/mail-react": minor
---

Add `theme.list` spacing tokens for the lists rendered by the RichText block

`indent` sets the space before the marker, `markerGap` the space between the marker and the item's text, and `itemSpacing` the space between items. All three accept responsive values.

```ts
const theme = createTheme({
    list: {
        indent: { default: 24, mobile: 16 },
        markerGap: 12,
        itemSpacing: 8,
    },
});
```
