---
"@comet/admin": minor
---

Add the ContentTranslationServiceProvider which can be used to wrap components that use FinalFormInput (and later also RTE) to enable the activation of the translation feature.

```tsx
<ContentTranslationServiceProvider
    enabled={true}
    translate={async function (input: string): Promise<string> {
        return yourTranslationFnc(value);
    }}
>
    ...
</ContentTranslationServiceProvider>
```

You can hide the translation button on the FinalFormInput by adding the disableTranslation prop.

```tsx
<Field
    required
    fullWidth
    name="myField"
    component={FinalFormInput}
    disableTranslation
    label={<FormattedMessage id="myField" defaultMessage="My Field" />}
/>
```
