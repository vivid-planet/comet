---
"@comet/admin-date-time": major
---

Change the theme name of components by prefixing them with `DT`

All components are now prefixed with `CometAdminDT` instead of `CometAdmin`.
If any of the components have custom styles or default props defined in the theme, the key needs to be updated.

- `CometAdminDatePickerNavigation` -> `CometAdminDTDatePickerNavigation`
- `CometAdminDatePicker` -> `CometAdminDTDatePicker`
- `CometAdminDateRangePicker` -> `CometAdminDTDateRangePicker`
- `CometAdminDateTimePicker` -> `CometAdminDTDateTimePicker`
- `CometAdminTimePicker` -> `CometAdminDTTimePicker`
- `CometAdminTimeRangePicker` -> `CometAdminDTTimeRangePicker`

```diff
 export const theme = createCometTheme({
     components: {
-        CometAdminDatePicker: {
+        CometAdminDTDatePicker: {
             defaultProps: {
                 monthsToShow: 2,
             },
         },
-        CometAdminDateTimePicker: {
+        CometAdminDTDateTimePicker: {
             styleOverrides: {
                 root: {
                     backgroundColor: "magenta",
                 },
             },
         },
     },
 });
```
