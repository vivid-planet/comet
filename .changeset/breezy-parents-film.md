---
"@comet/admin-icons": minor
"@comet/admin-rte": minor
"@comet/cms-admin": minor
---

Add support for non-breaking spaces to RTE

Add `"non-breaking-space"` to `supports` when creating an RTE:

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
                    // Non-breaking space
                    "non-breaking-space",
                    // Other options you may wish to support
                    "bold",
                    "italic",
                ],
            }}
        />
    );
}
```
