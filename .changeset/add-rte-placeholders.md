---
"@comet/admin-rte": minor
"@comet/cms-api": minor
---

Add `placeholders` option to `IRteOptions` for inserting pre-defined, non-editable placeholder tokens

Placeholders are rendered as styled pills in the editor and use Draft.js IMMUTABLE entities, meaning they can only be removed as a whole and cannot be partially edited.

**Example**

```tsx
const rteOptions: IRteOptions = {
    supports: ["bold", "italic"],
    placeholders: [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
    ],
};

<Rte value={editorState} onChange={setEditorState} options={rteOptions} />;
```
