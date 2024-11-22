---
"@comet/admin": minor
---

Add the `dataGridDateColumn` and `dataGridDateTimeColumn` helpers for using the "date" and "dateTime" types in Data Grid

```diff
 import { useIntl } from "react-intl";
-import { GridColDef } from "@comet/admin";
+import { GridColDef, dataGridDateColumn, dataGridDateTimeColumn } from "@comet/admin";

 // ...

 const intl = useIntl();
 const columns: GridColDef[] = [
     {
-       type: "date",
-       valueGetter: ({ value }) => value && new Date(value),
-       valueFormatter: ({ value }) => value && intl.formatDate(value, { dateStyle: "medium" }),
+       ...dataGridDateColumn,
        field: "createdAt",
        headerName: "Created At",
     },
     {
-      type: "dateTime",
-      valueGetter: ({ value }) => value && new Date(value),
-      valueFormatter: ({ value }) => value && intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }),
+      ...dataGridDateTimeColumn,
       field: "updatedAt",
       headerName: "Updated At",
     },
 ];
```
