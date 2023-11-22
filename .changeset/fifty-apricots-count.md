---
"@comet/admin": patch
---

Fix a bug in `FinalForm` where the submit mutation wasn't correctly awaited if a `FinalForm` using an asynchronous validation was saved via the `saveAction` provided by the `RouterContext`. 

In practice, this affected `FinalForm`s within an `EditDialog`. 
The `EditDialog` closed before the submission was completed. All changes were omitted. The result of the submission (fail or success) was never shown.
