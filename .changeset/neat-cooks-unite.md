---
"@comet/admin": minor
---

Allow passing a `ReactNode` to `fieldLabel` of `CheckboxField` and `SwitchField`

This enables using `FormattedMessage` for the label.

```tsx
<CheckboxField name="visible" fieldLabel={<FormattedMessage id="exampleForm.visible" defaultMessage="Visible" />} />
<SwitchField name="visible" fieldLabel={<FormattedMessage id="exampleForm.visible" defaultMessage="Visible" />} />
```
