---
"@comet/admin": minor
---

Add new `Future_DateTimePicker` and `Future_DateTimePickerField` components

These are based on the `@mui/x-date-pickers` `DateTimePicker`. Unlike the MUI component which uses a `Date` value, these components use a `string` (`YYYY-MM-DDTHH:mm`) for `value` and `onChange`, consistent with Comet's other date/time inputs.

Examples:

Using the new DateTimePicker

```diff
-import { DateTimePicker } from "@comet/admin-date-time";
+import { Future_DateTimePicker as DateTimePicker } from "@comet/admin";

const [value, setValue] = useState<string | undefined>();

<DateTimePicker value={value} onChange={setValue} />
```

Using the new DateTimePickerField with Final Form

```diff
-import { FinalFormDateTimePicker } from "@comet/admin-date-time";
+import { Future_DateTimePickerField as DateTimePickerField } from "@comet/admin";

<DateTimePickerField name="dateTime" label="Date-Time" />
```
