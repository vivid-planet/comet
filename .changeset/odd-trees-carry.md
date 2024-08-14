---
"@comet/admin": minor
---

Add `CheckboxListField` component to make it easier to create checkbox lists in forms

You can now do:

```tsx
<CheckboxListField
    label="Checkbox List"
    name="checkboxList"
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
<FieldContainer label="Checkbox List" fullWidth>
    <CheckboxField name="checkboxList" label="Checkbox one" value="checkbox-one" />
    <CheckboxField name="checkboxList" label="Checkbox two" value="checkbox-two" />
</FieldContainer>
```
