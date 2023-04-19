---
"@comet/admin-color-picker": minor
"@comet/admin-date-time": minor
"@comet/admin": minor
---

Add field components to simplify the creation of forms with final-form.

-   TextField
-   TextAreaField
-   SearchField
-   SelectField
-   CheckboxField
-   SwitchField
-   ColorField
-   DateField
-   DateRangeField
-   TimeField
-   TimeRangeField
-   DateTimeField

**Example with TextField**

```tsx
// You can now do:
<TextField name="text" label="Text" />
```

```tsx
// Instead of:
<Field name="text" label="Text" component={FinalFormInput} />
```

**Example with SelectField**

```tsx
// You can now do:
<SelectField name="select" label="Select">
    {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
            {option.label}
        </MenuItem>
    ))}
</SelectField>
```

```tsx
// Instead of:
<Field name="select" label="Select">
    {(props) => (
        <FinalFormSelect {...props}>
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </FinalFormSelect>
    )}
</Field>
```
