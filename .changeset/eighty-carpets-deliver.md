---
"@comet/cms-api": patch
---

Fix the duplicate filename check in `FilesService#updateByEntity`

Previously, we checked the existing file name (`entity.name`) for the check instead of the new name (`input.name`). This never resulted in an error.
