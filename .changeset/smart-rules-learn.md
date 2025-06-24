---
"@comet/admin": major
---

`DatePicker` from `@mui/x-date-pickers` is now used inside `DataGrid` filters

This change replaces the previous `TextField` with `<input type="date" />` for an improved user experience.

`@mui/x-date-pickers` has been added as a peer dependency and must be installed in your project's `admin` package.
`LocalizationProvider` must be added to your app's root and configured with `date-fns` as the date adapter.

`admin/package.json`

```diff
    "dependencies": {
+       "@mui/x-date-pickers": "^7.29.4",
+       "date-fns": "^4.1.0",
    }
```

`admin/src/App.tsx`

```diff
+import { LocalizationProvider } from "@mui/x-date-pickers";
+import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
+import { enUS } from "date-fns/locale";

 // ...

 <IntlProvider locale="en" messages={getMessages()}>
+    <LocalizationProvider adapterLocale={enUS} dateAdapter={AdapterDateFns}>
         <MuiThemeProvider theme={theme}>
             {/* ... */}
         </MuiThemeProvider>
+    </LocalizationProvider>
 </IntlProvider>
```
