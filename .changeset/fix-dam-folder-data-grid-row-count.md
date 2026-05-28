---
"@comet/cms-admin": patch
---

Fix `1-NaN of NaN` pagination footer and `rowCount` warning in DAM `FolderDataGrid`

The grid now routes `totalCount` through `useBufferedRowCount`, so `rowCount` stays a number across refetches instead of becoming `undefined` while data is loading.
