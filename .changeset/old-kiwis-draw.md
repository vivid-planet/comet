---
"@comet/admin": major
---

Remove the "Future" prefix from date/time components as they are now considered stable

**If already in use, update the imports of these components and their types:**

DatePicker:

- `Future_DatePicker` -> `DatePicker`
- `Future_DatePickerProps` -> `DatePickerProps`
- `Future_DatePickerClassKey` -> `DatePickerClassKey`
- `Future_DatePickerField` -> `DatePickerField`
- `Future_DatePickerFieldProps` -> `DatePickerFieldProps`

DateRangePicker:

- `Future_DateRangePicker` -> `DateRangePicker`
- `Future_DateRangePickerProps` -> `DateRangePickerProps`
- `Future_DateRangePickerClassKey` -> `DateRangePickerClassKey`
- `Future_DateRangePickerField` -> `DateRangePickerField`
- `Future_DateRangePickerFieldProps` -> `DateRangePickerFieldProps`

TimePicker:

- `Future_TimePicker` -> `TimePicker`
- `Future_TimePickerProps` -> `TimePickerProps`
- `Future_TimePickerClassKey` -> `TimePickerClassKey`
- `Future_TimePickerField` -> `TimePickerField`
- `Future_TimePickerFieldProps` -> `TimePickerFieldProps`

**If your theme is using `defaultProps` or `styleOverrides` for any of these components, update their component-keys:**

- `CometAdminFutureDatePicker` -> `CometAdminDatePicker`
- `CometAdminFutureDateRangePicker` -> `CometAdminDateRangePicker`
- `CometAdminFutureTimePicker` -> `CometAdminTimePicker`

**If you are using class-names to access these components' slots, update them:**

- `CometAdminFuture_DatePicker-*` -> `CometAdminDatePicker-*`
- `CometAdminFuture_DateRangePicker-*` -> `CometAdminDateRangePicker-*`
- `CometAdminFuture_TimePicker-*` -> `CometAdminTimePicker-*`
