---
"@comet/cms-admin": major
---

Update Scope Picker to display all scope dimensions in a single dropdown.

This requires the scopes to be transformed into a new format with all possible combinations.

Example:

```js
[
    {
        domain: { label: "Main", value: "main" },
        language: { label: "English", value: "en" },
    },
    {
        domain: { label: "Main", value: "main" },
        language: { label: "German", value: "de" },
    },
    {
        domain: { label: "Secondary", value: "secondary" },
        language: { label: "English", value: "en" },
    },
];
```
