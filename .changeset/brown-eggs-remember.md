---
"@comet/admin": minor
---

Add `gridColumnTypes`, a group of helpers for using the "date" and "dateTime" types in Data Grid

```diff
 import { useIntl } from "react-intl";
-import { GridColDef } from "@comet/admin";
+import { GridColDef, gridColumnTypes } from "@comet/admin";

 // ...

 const intl = useIntl();
 const columns: GridColDef[] = [
     {
-       type: "date",
-       valueGetter: ({ value }) => value && new Date(value),
-       valueFormatter: ({ value }) => value && intl.formatDate(value, { dateStyle: "medium" }),
+       ...gridColumnTypes.date(intl),
        field: "createdAt",
        headerName: "Created At",
     },
     {
-      type: "dateTime",
-      valueGetter: ({ value }) => value && new Date(value),
-      valueFormatter: ({ value }) => value && intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }),
+      ...gridColumnTypes.dateTime(intl),
       field: "updatedAt",
       headerName: "Updated At",
     },
 ];
```
