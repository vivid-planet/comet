---
"@comet/admin": patch
---


Fix `submit` implementation for `DirtyHandler` in `FinalForm`

The submit mutation wasn't correctly awaited if a `FinalForm` using an asynchronous validation was saved via the `saveAction` provided in the `RouterPrompt`.

In practice, this affected `FinalForm`s within an `EditDialog`. The `EditDialog` closed before the submission was completed. All changes were omitted. The result of the submission (fail or success) was never shown.