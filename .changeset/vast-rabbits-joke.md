---
"@comet/admin": patch
---

Prevent the `OpenPickerButton` from appearing focused while not actually being focused

This was achieved by preventing the `OpenPickerButton` from being focused at all.
The input value can still be changed in an accessible way, without using the picker.

This affects the following components:

- `DatePicker`
- `DatePickerField`
- `DateRangePicker`
- `DateRangePickerField`
- `DateTimePicker`
- `DateTimePickerField`
- `TimePicker`
- `TimePickerField`
