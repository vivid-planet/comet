---
"@comet/admin-rte": minor
"@comet/cms-admin": minor
---

SoftHyphen Decorator is moved from `cms-admin` to `admin-rte`.

Usage of the option does not change.

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
