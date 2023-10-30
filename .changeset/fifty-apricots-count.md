---
"@comet/admin": patch
---

Fix a bug in `FinalForm` where the submit mutation wasn't correctly awaited if a `FinalForm` inside an `EditDialog` used an asynchronous validation. 
Instead, the EditDialog closed before the submission was completed. All changes were omitted. The result of the submission (fail or success) was never shown.
