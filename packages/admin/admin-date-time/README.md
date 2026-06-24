# @comet/admin-date-time

> **Deprecated:** This package is deprecated. Its date and time picker components have been replaced by MUI X-based components in [`@comet/admin`](../admin). Use those instead.

## Replacement components

| `@comet/admin-date-time`   | `@comet/admin`                                     |
| -------------------------- | -------------------------------------------------- |
| `DatePicker`               | `DatePicker`                                       |
| `DateField`                | `DatePickerField`                                  |
| `FinalFormDatePicker`      | `DatePickerField` (without using `<Field />`)      |
| `DateRangePicker`          | `DateRangePicker`                                  |
| `DateRangeField`           | `DateRangePickerField`                             |
| `FinalFormDateRangePicker` | `DateRangePickerField` (without using `<Field />`) |
| `TimePicker`               | `TimePicker`                                       |
| `TimeField`                | `TimePickerField`                                  |
| `FinalFormTimePicker`      | `TimePickerField` (without using `<Field />`)      |
| `DateTimePicker`           | `DateTimePicker`                                   |
| `DateTimeField`            | `DateTimePickerField`                              |
| `FinalFormDateTimePicker`  | `DateTimePickerField` (without using `<Field />`)  |
| `TimeRangePicker`          | `TimeRangePicker`                                  |
| `TimeRangeField`           | `TimeRangePickerField`                             |
| `FinalFormTimeRangePicker` | `TimeRangePickerField` (without using `<Field />`) |

For localization, the new components rely on MUI X's `LocalizationProvider` (with `AdapterDateFns`) instead of `DateFnsLocaleProvider`.

See the [migration guide from v8 to v9](../../../docs/docs/7-migration-guide/migration-from-v8-to-v9.md) for details.
