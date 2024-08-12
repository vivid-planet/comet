---
"@comet/admin": minor
---

Make the separator of `FinalFormRangeInput` overridable using the `separator` prop and change the default to the string "to"

Example to restore the previous separator:

```tsx
<Field name="numberRange" label="Range Input" component={FinalFormRangeInput} min={0} max={100} separator="-" />
```
