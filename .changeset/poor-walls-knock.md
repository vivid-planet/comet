---
"@comet/admin": minor
---

Add new `Future_DatePicker` and `Future_DatePickerField` components

These will replace the existing `DatePicker`, `FinalFormDatePicker` and `DateField` components from `@comet/admin-date-time` as a mostly drop-in replacement.

The new components are based on the `@mui/x-date-pickers` package, so you can refer to the [MUI documentation](https://v7.mui.com/x/react-date-pickers/date-picker/) for more details.
Unlike the MUI components, these components use a `string` (`YYYY-MM-DD`) as the value, instead of `Date`, just like the existing components from `@comet/admin-date-time`.

**Using the new `DatePicker`**

```diff
-import { FieldContainer } from "@comet/admin";
-import { DatePicker } from "@comet/admin-date-time";
+import { Future_DatePicker as DatePicker, FieldContainer } from "@comet/admin";
 import { useState } from "react";

 export const Example = () => {
     const [dateValue, setDateValue] = useState<string | undefined>();

     return (
         <FieldContainer label="Date Picker">
             <DatePicker value={dateValue} onChange={setDateValue} />
         </FieldContainer>
     );
 };
```

**Using the new `DatePickerField` in Final Form**

```diff
-import { DateField } from "@comet/admin-date-time";
+import { Future_DatePickerField as DatePickerField } from "@comet/admin";
 import { Form } from "react-final-form";

 type Values = {
     date: string;
 };

 export const Example = () => {
     return (
         <Form<Values> initialValues={{ date: "2025-07-23" }} onSubmit={() => {}}>
             {() => (
-                <DateField name="date" label="Date Picker" />
+                <DatePickerField name="date" label="Date Picker" />
             )}
         </Form>
     );
 };
```
