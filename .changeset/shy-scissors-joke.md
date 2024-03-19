---
"@comet/cms-api": major
---

API Generator: Remove support for `visible` boolean, use `status` enum instead.

Recommended enum values: Published/Unpublished or Visible/Invisible or Active/Deleted or Active/Archived

Remove support for update visibility mutation, use existing generic update instead
