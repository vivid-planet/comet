---
"@comet/admin": minor
"@comet/admin-date-time": minor
---

Add new `Future_TimePicker` and `Future_TimePickerField` components

These will replace the existing `TimePicker`, `FinalFormTimePicker` and `TimeField` components from `@comet/admin-date-time` as a mostly drop-in replacement, the existing components have been deprecated.

The new components are based on the `@mui/x-date-pickers` package, so you can refer to the [MUI documentation](https://v7.mui.com/x/react-date-pickers/time-picker/) for more details.
Unlike the MUI components, these components use a 24h `string` (`HH:mm`) as the value, instead of `Date`, just like the existing components from `@comet/admin-date-time`.

**Using the new `TimePicker`**

```diff
-import { FieldContainer } from "@comet/admin";
-import { TimePicker } from "@comet/admin-date-time";
+import { Future_TimePicker as TimePicker, FieldContainer } from "@comet/admin";
 import { useState } from "react";

 export const Example = () => {
     const [timeValue, setTimeValue] = useState<string | undefined>();

     return (
         <FieldContainer label="Time Picker">
             <TimePicker value={timeValue} onChange={setTimeValue} />
         </FieldContainer>
     );
 };
```

**Using the new `TimePickerField` in Final Form**

```diff
-import { TimeField } from "@comet/admin-date-time";
+import { Future_TimePickerField as TimePickerField } from "@comet/admin";
 import { Form } from "react-final-form";

 type Values = {
     time: string;
 };

 export const Example = () => {
     return (
         <Form<Values> initialValues={{ time: "11:30" }} onSubmit={() => {}}>
             {() => (
-                <TimeField name="time" label="Time Picker" />
+                <TimePickerField name="time" label="Time Picker" />
             )}
         </Form>
     );
 };
```
