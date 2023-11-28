---
"@comet/admin": patch
---

Fix `EditDialog#onAfterSave` not called on form submission

The `onAfterSave` callback was only called when submitting a form inside an `EditDialog` by clicking the save button, but not when submitting the form by hitting the enter key.
We fix this by adding the callback to the `EditDialogFormApi` and calling it after the form has been successfully submitted.
