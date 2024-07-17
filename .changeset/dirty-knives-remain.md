---
"@comet/admin": patch
---

Allow options with empty id to clear the form value when using `FinalFormSelect`/`SelectField` with the `options` prop and `FinalFormAsyncSelect`/`AsyncSelectField`

Previously, selecting "No Value" from the example below would set the form value to the option object itself.
Now, the form value is set to `undefined` when an option is selected with an id of an empty string.

```tsx
const options = [
    { id: "", title: "No Value" },
    { id: "chocolate", title: "Chocolate" },
];
// ...
<Field name="select" label="Select">
    {(props) => (
        <FinalFormSelect
            {...props}
            options={options}
            getOptionLabel={(option) => option.title}
            getOptionSelected={(option, value) => option.title === value.title}
        />
    )}
</Field>
```

This behavior is now consistent with `FinalFormSelect` when rendering the options as children.

```tsx
<Field name="select" label="Select">
    {(props) => (
        <FinalFormSelect {...props}>
            <MenuItem value="">No Value</MenuItem>
            <MenuItem value="chocolate">Chocolate</MenuItem>
        </FinalFormSelect>
    )}
</Field>
```
