---
"@dextinity/cms-api": patch
---

Fix validation of blocks without fields

Saving a document containing a block without fields, e.g., a link block variant that only marks a type, failed with a 400 error.
class-validator rejects values whose class has no validation metadata at all (`forbidUnknownValues`, enabled by default since v0.14).
Block inputs now always carry validation metadata, so blocks without fields pass validation again.
