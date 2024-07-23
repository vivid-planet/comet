---
"@comet/cms-admin": patch
---

Fix `DocumentInterface.updateMutation` type

The type for the `input` variable needs to be `DocumentOutput`, not `DocumentInput`.
