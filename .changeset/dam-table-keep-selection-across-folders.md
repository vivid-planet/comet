---
"@comet/cms-admin": patch
---

Keep DAM table selection across folder navigation

The DAM `DataGrid` is now set to `keepNonExistentRowsSelected`, so bulk-selecting files in one folder and navigating to another keeps the previous selection in the toolbar's selection map. Required so that multi-file pickers can collect files across folders.
