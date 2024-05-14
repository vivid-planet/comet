---
"@comet/cms-api": patch
"@comet/cms-admin": patch
---

DAM: Fix the duplicate name check when updating a file

Previously, there were two bugs:

1. In the `EditFile` form, the `folderId` wasn't passed to the mutation
2. In `FilesService#updateByEntity`, the duplicate check was always done against the root folder if no `folderId` was passed

This caused an error when saving a file in any folder if there was another file with the same name in the root folder.
And it was theoretically possible to create two files with the same name in one folder (though this was still prevented by admin-side validation).
