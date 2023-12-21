---
"@comet/admin": minor
---

Add `EllipsisTooltip` component

Used to automatically add a tooltip to text that is too long to fit in its container.
This is useful for displaying text in a table or data grid when the text might be too long to fit in the column.

```tsx
<ElementThatIsNotVeryBig>
    <EllipsisTooltip>{textThatMightBeVeryLong}</EllipsisTooltip>
</ElementThatIsNotVeryBig>
```
