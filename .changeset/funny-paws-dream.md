---
"@comet/cms-admin": minor
---

Add `ContentScopeSelect` component

This can be used as the basis for both content-driven and data-driven applications.

**Example**

```tsx
function ContentScopeControls() {
    const [value, setValue] = useState({ domain: "main", language: "en" });

    return (
        <ContentScopeSelect
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                { domain: { label: "Main", value: "main" }, language: { label: "English", value: "en" } },
                { domain: { label: "Main", value: "main" }, language: { label: "German", value: "de" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "English", value: "en" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "German", value: "de" } },
            ]}
        />
    );
}
```
