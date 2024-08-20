---
"@comet/admin": minor
---

Add an `options` prop to `SelectField` as an alternative to `children`

Note: the behavior of the `options` prop differs from `FinalFormSelect` and is only intended to work with static options.
Use the existing `AsyncSelectField` for dynamic options.

-   Each option must have the `value` and `label` properties. A custom structure is not supported.
-   There are no `getOptionLabel` and `getOptionValue` props. The `label` and `value` properties are used directly.
-   The value stored in the form state is the `value` property, not the whole option object.

```tsx
const options: SelectFieldOption[] = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "raspberry", label: "Raspberry" },
];

// ...

<SelectField name="flavor" label="Select a flavor" options={options} fullWidth />;
```
