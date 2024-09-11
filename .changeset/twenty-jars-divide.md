---
"@comet/admin": minor
---

Add the ability to disable individual `CheckboxListField` and `RadioGroupField` options

```tsx
const options = [
    {
        label: "Selectable",
        value: "selectable",
    },
    {
        label: "Disabled",
        value: "disabled",
        disabled: true,
    },
];

const FormFields = () => (
    <>
        <CheckboxListField label="Checkbox List" name="checkboxList" options={options} />
        <RadioGroupField label="Radio Group" name="radioGroup" fullWdth options={options} />
    </>
);
```
