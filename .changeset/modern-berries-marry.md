---
"@comet/blocks-admin": minor
---

Add `label` prop to `ColumnsLayoutPreview`

Use it to customize the label of the column displayed in the `FinalFormLayoutSelect`.
For instance, to add an icon or add custom text:

```tsx
<ColumnsLayoutPreviewContent width={10} label={<Image />} />
```
