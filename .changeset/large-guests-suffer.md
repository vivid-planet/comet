---
"@comet/admin": minor
---

Add support for the `options` prop to `SelectField`, similar to `FinalFormSelect`

```tsx
type Option {
    value: string;
    label: string;
}

const options: Option[] = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
];

// ...

<SelectField
    name="select"
    label="Select a flavor"
    fullWidth
    options={options}
    getOptionLabel={(option: Option) => option.label}
    getOptionSelected={(option: Option, value: Option) => option.value === value.value}
/>
```
