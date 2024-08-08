---
"@comet/admin": minor
---

Add the `disableSlider` prop to `FinalFormRangeInput` to disable the slider and only show the input fields

```tsx
<Field name="numberRange" label="Range Input" component={FinalFormRangeInput} min={0} max={100} disableSlider />
```
