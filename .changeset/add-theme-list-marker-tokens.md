---
"@dextinity/mail-react": minor
---

Add `theme.list.unorderedMarker` and `theme.list.orderedMarker` for the markers of the lists the RichText block renders

Each marker is either a fixed node or a function of the item's zero-based `index` in its own list and that list's `depth`:

```tsx
const theme = createTheme({
    list: {
        unorderedMarker: ({ depth }) => ["▪", "–", "·"][depth % 3],
        // 97 is the code of "a", so nested items are lettered a., b., c.
        orderedMarker: ({ index, depth }) => (depth === 0 ? `${index + 1}.` : `${String.fromCharCode(97 + index)}.`),
    },
});
```
