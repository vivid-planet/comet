---
"@comet/admin-rte": minor
"@comet/cms-admin": minor
---

Move soft-hyphen functionality to `@comet/admin-rte`

This allows using the soft-hyphen functionality in plain RTEs, and not only in `RichTextBlock`

```tsx
const [useRteApi] = makeRteApi();

export default function MyRte() {
    const { editorState, setEditorState } = useRteApi();
    return (
        <Rte
            value={editorState}
            onChange={setEditorState}
            options={{
                supports: [
                    // Soft Hyphen
                    "soft-hyphen",
                    // Other options you may wish to support
                    "bold",
                    "italic",
                ],
            }}
        />
    );
}
```
