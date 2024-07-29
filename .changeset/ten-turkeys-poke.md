---
"@comet/admin-date-time": major
---

Rename multiple props and class-keys and remove the `componentsProps` types:

-   `DatePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `DatePickerComponentsProps` type

-   `DateRangePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `DateRangePickerComponentsProps` type
    -   Rename the `calendar` class-key to `dateRange`

-   `DateTimePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `DateTimePickerComponentsProps` type
    -   Replace the `formControl` class-key with two separate class-keys: `dateFormControl` and `timeFormControl`

-   `TimeRangePicker`:

    -   Replace the `componentsProps` prop with `slotProps`
    -   Remove the `TimeRangePickerComponentsProps` and `TimeRangePickerIndividualPickerProps` types
    -   Replace the `formControl` class-key with two separate class-keys: `startFormControl` and `endFormControl`
    -   Replace the `timePicker` class-key with two separate class-keys: `startTimePicker` and `endTimePicker`
