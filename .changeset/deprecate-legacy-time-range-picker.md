---
"@comet/admin-date-time": major
---

Deprecate `TimeRangePicker`, `TimeRangeField` and `FinalFormTimeRangePicker` and add a "Legacy" prefix to their class-names and theme component-key

Their new counterparts in `@comet/admin` are now considered stable.

**Consider using the new components from `@comet/admin`**

In most cases, the new components will be a drop-in replacement for the legacy components, so you can simply replace the imports:

| Legacy component from `@comet/admin-date-time` | New component from `@comet/admin`                  |
| ---------------------------------------------- | -------------------------------------------------- |
| `TimeRangePicker`                              | `TimeRangePicker`                                  |
| `TimeRangeField`                               | `TimeRangePickerField`                             |
| `FinalFormTimeRangePicker`                     | `TimeRangePickerField` (without using `<Field />`) |

**To continue using the existing component, the following changes will need to be made:**

Update any use of class-names of the component's slots:

- `CometAdminTimeRangePicker-*` -> `CometAdminLegacyTimeRangePicker-*`

Update the component-key when using `defaultProps` or `styleOverrides` in the theme:

- `CometAdminTimeRangePicker` -> `CometAdminLegacyTimeRangePicker`
