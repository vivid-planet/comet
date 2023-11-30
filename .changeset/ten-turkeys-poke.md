---
"@comet/admin-date-time": major
---

Renamed some props and class-keys and removed the `componentsProps` types:

-   `DatePicker`:

    -   Renamed the `componentsProps` prop to `slotProps`
    -   Removed the `DatePickerComponentsProps` type

-   `DateRangePicker`:

    -   Renamed the `componentsProps` prop to `slotProps`
    -   Removed the `DateRangePickerComponentsProps` type
    -   Renamed the `calendar` ClassKey to `dateRange`

-   `DateTimePicker`:

    -   Renamed the `componentsProps` prop to `slotProps`
    -   Removed the `DateTimePickerComponentsProps` type
    -   Removed the `formControl` ClassKey and replaced it with two separate class keys: `dateFormControl` and `timeFormControl`
