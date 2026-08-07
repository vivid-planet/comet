---
"@comet/cms-admin": minor
---

Export `validateUrl`

The validator can now be used for URL fields in application code, for instance, in a custom block:

```tsx
createCompositeBlockTextField({
    label: <FormattedMessage id="organization.url" defaultMessage="URL" />,
    validate: validateUrl,
});
```
