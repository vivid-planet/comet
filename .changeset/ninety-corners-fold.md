---
"@comet/admin": minor
"@comet/admin-date-time": minor
---

Add new `Future_DateTimePicker` and `Future_DateTimePickerField` components

These will replace the existing `DateTimePicker`, `FinalFormDateTimePicker` and `DateTimeField` components from `@comet/admin-date-time` as a mostly drop-in replacement, the existing components have been deprecated.

The new components are based on the `@mui/x-date-pickers` package, so you can refer to the [MUI documentation](https://v7.mui.com/x/react-date-pickers/date-time-picker/) for more details.

**Using the new `DateTimePicker`**

```diff
-import { FieldContainer } from "@comet/admin";
-import { DateTimePicker } from "@comet/admin-date-time";
+import { Future_DateTimePicker as DateTimePicker, FieldContainer } from "@comet/admin";
 import { useState } from "react";

 export const Example = () => {
     const [dateTime, setDateTime] = useState<Date | undefined>();

     return (
         <FieldContainer label="Date-Time Picker">
             <DateTimePicker value={dateTime} onChange={setDateTime} />
         </FieldContainer>
     );
 };
```

**Using the new `DateTimePickerField` in Final Form**

```diff
-import { DateTimeField } from "@comet/admin-date-time";
+import { Future_DateTimePickerField as DateTimePickerField } from "@comet/admin";
 import { Form } from "react-final-form";

 type Values = {
     dateTime: Date;
 };

 export const Example = () => {
     return (
         <Form<Values> initialValues={{ dateTime: new Date("2025-07-23 14:30") }} onSubmit={() => {}}>
             {() => (
-                <DateTimeField name="dateTime" label="Date-Time Picker" />
+                <DateTimePickerField name="dateTime" label="Date-Time Picker" />
             )}
         </Form>
     );
 };
```
