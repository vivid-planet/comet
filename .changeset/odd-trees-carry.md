---
"@comet/admin": minor
---

Add `CheckboxGroupField` component to make it easier to create checkbox group fields in forms

You can now do:

```tsx
<CheckboxGroupField
    label="Checkbox Group"
    name="checkboxGroup"
    fullWidth
    options={[
        {
            label: "Option One",
            value: "option-one",
        },
        {
            label: "Option Two",
            value: "option-two",
        },
    ]}
/>
```

instead of:

```tsx
<FieldContainer label="Checkbox Group" fullWidth>
    <CheckboxField name="checkboxList" label="Checkbox one" value="checkbox-one" />
    <CheckboxField name="checkboxList" label="Checkbox two" value="checkbox-two" />
</FieldContainer>
```
