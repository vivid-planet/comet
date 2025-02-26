---
"@comet/admin": minor
---

Support dynamic values for the `label` prop of `SwitchField` depending on its `checked` state

```tsx
<SwitchField name="switch" label={(checked) => (checked ? "On" : "Off")} />
```
