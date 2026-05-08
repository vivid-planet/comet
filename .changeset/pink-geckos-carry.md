---
"@comet/admin": major
---

Remove `clearable` prop from `Autocomplete`, `FinalFormInput`, `FinalFormNumberInput` and `FinalFormSearchTextField`

Those fields are now clearable automatically when not set to `required`, `disabled` or `readOnly`.
