---
"@comet/admin": minor
---

Savable: add optional fetchHasChanges that can return hasChanges (aka dirty) before Savable re-renders and updates the hasChanges prop

Fixes issue in Form where a "Save changes?"-Dialog appears right after adding a new entry
