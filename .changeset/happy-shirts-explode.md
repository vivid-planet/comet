---
"@comet/admin": minor
---

Add a `RadioField` component to make it easier to create radio fields in final forms

You can now do:

```tsx
<FieldContainer label="Radio" fullWidth>
    <RadioField name="radio" label="Option One" value="option-one" />
    <RadioField name="radio" label="Option Two" value="option-two" />
</FieldContainer>
```

instead of:

```tsx
<FieldContainer label="Radio" fullWidth>
    <Field name="radio" type="radio" value="option-one">
        {(props) => <FormControlLabel label="Option One" control={<FinalFormRadio {...props} />} />}
    </Field>
    <Field name="radio" type="radio" value="option-two">
        {(props) => <FormControlLabel label="Option Two" control={<FinalFormRadio {...props} />} />}
    </Field>
</FieldContainer>
```
