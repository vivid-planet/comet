---
"@comet/admin": patch
---

Apply theme customizations for `DateRangePicker`

`defaultProps` and `styleOverrides` defined for `CometAdminDateRangePicker` had no effect, as the component read its theme props from `CometAdminFutureDateRangePicker`.
