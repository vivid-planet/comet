---
"@comet/cms-admin": major
"@comet/admin": major
---

Remove `clearable` prop from `FinalFormSelect` and `FinalFormAsyncSelect`

`FinalFormSelect` and `FinalFormAsyncSelect` that do not have set `multiple` are now clearable when `required` is not set.
A placeholder item is added to the options and it is preselected.