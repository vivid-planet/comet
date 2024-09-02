---
"@comet/admin-color-picker": patch
"@comet/admin-date-time": patch
"@comet/admin": patch
---

Deprecate FinalForm components where a Field component exists as a simpler alternative

-   Use `<AutocompleteField />` instead of `<Field component={FinalFormAutocomplete} />`
-   Use `<CheckboxField />` instead of `<Field />` with `<FormControlLabel />` and `<FinalFormCheckbox />`
-   Use `<AsyncAutocompleteField />` instead of `<Field component={FinalFormAsyncAutocomplete} />`
-   Use `<AsyncSelectField />` instead of `<Field component={FinalFormAsyncSelect} />`
-   Use `<NumberField />` instead of `<Field component={FinalFormNumberInput} />`
-   Use `<SearchField />` instead of `<Field component={FinalFormSearchTextField} />`
-   Use `<SelectField />` instead of `<Field />` with `<FinalFormSelect />`
-   Use `<SwitchField />` instead of `<Field />` with `<FormControlLabel />` and `<FinalFormSwitch />`
-   Use `<DateField />` instead of `<Field component={FinalFormDatePicker} />`
-   Use `<DateRangeField />` instead of `<Field component={FinalFormDateRangePicker} />`
-   Use `<DateTimeField />` instead of `<Field component={FinalFormDateTimePicker} />`
-   Use `<TimeField />` instead of `<Field component={FinalFormTimePicker} />`
-   Use `<TimeRangeField />` instead of `<Field component={FinalFormTimeRangePicker} />`
-   Use `<ColorField />` instead of `<Field component={FinalFormColorPicker} />`
