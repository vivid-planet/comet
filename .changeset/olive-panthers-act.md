---
"@comet/admin": minor
---

Add `AutocompleteField` and `AsyncAutocompleteField` components

**Examples**

```tsx
<AutocompleteField
    name="autocomplete"
    label="Autocomplete"
    options={[
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ]}
    getOptionLabel={(option: Option) => option.label}
    isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
    fullWidth
/>
```

```tsx
<AsyncAutocompleteField
    name="asyncAutocomplete"
    label="Async Autocomplete"
    loadOptions={async () => {
        // Load options here
    }}
    getOptionLabel={(option: Option) => option.label}
    isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
    fullWidth
/>
```
