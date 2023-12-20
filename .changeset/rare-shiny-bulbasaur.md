---
"@comet/admin": minor
---

Add basis for content translation

Wrap a component with a `ContentTranslationServiceProvider` to add support for content translation to all underlying `FinalFormInput` inputs.

```tsx
<ContentTranslationServiceProvider
    enabled={true}
    translate={async function (text: string): Promise<string> {
        return yourTranslationFnc(text);
    }}
>
    ...
</ContentTranslationServiceProvider>
```

You can disable translation for a specific `FinalFormInput` by using the `disableContentTranslation` prop.

```tsx
<Field
    required
    fullWidth
    name="myField"
    component={FinalFormInput}    
    label={<FormattedMessage id="myField" defaultMessage="My Field" />}

    disableContentTranslation
/>
```
