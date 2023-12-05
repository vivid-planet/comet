---
"@comet/admin": minor
---

Add the TranslationConfigProvider which can be used to wrap components that use FinalFormInput (and later also RTE) to enable the activation of the translation feature.

```ts
<TranslationConfigProvider value={{ enableTranslation: true, translate: (value: string) => yourTranslationFnc(value) }}>...</TranslationConfigProvider>
```

You can hide the translation button on the FinalFormInput by adding the hideTranslate prop.

```ts
<Field
   required
   fullWidth
   name="myField"
   component={FinalFormInput}
   hideTranslate
   label={<FormattedMessage id="myField" defaultMessage="My Field" />}
/>
```
