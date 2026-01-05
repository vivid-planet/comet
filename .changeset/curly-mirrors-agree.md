---
"@comet/admin-date-time": major
---

Add a "Legacy" prefix to class-names and theme component-keys

This affects the components of which their new counterparts are now considered stable in `@comet/admin`.

**Consider using the new components from `@comet/admin`**

In most cases, the new components will be a drop-in replacement for the legacy components, so you can simply replace the imports:

| Legacy component from `@comet/admin-date-time` | New component from `@comet/admin`                      |
| ---------------------------------------------- | ------------------------------------------------------ |
| `DatePicker`                                   | `DatePicker`                                           |
| `DateField`                                    | `DatePickerField`                                      |
| `FinalFormDatePicker`                          | `DatePickerField` (without using `Field` as a wrapper) |

**To continue using the existing components, the following changes will need to be made:**

Update any use of class-names of the component's slots:

- `CometAdminDatePicker-*` -> `CometAdminLegacyDatePicker-*`

Update the component-keys when using `defaultProps` or `styleOverrides` in the theme:

- `CometAdminDatePicker` -> `CometAdminLegacyDatePicker`
