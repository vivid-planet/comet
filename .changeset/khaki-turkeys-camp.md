---
"@comet/admin": patch
---

Fix `DataGridPagination` page information not pluralizing "items"

The default message for `comet.dataGridPagination.pageInformation` used a fixed plural form, forcing translations to follow the same shape. In languages with distinct singular/plural forms, this produced an incorrect result when `itemsTotal === 1`. The default message now uses ICU `plural` syntax so translators can branch on count.

Projects that maintain their own translation of `comet.dataGridPagination.pageInformation` should update it to use `plural` with `one` and `other` branches.
