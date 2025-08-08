---
"@comet/admin": minor
"@comet/admin-date-time": minor
---

Add new `Future_DateRangePicker` and `Future_DateRangePickerField` components

These will replace the existing `DateRangePicker`, `FinalFormDateRangePicker`, and `DateRangeField` components from `@comet/admin-date-time` as a mostly drop-in replacement, the existing components have been deprecated.

The new components are based on the `@mui/x-date-pickers-pro` package, so you can refer to the [MUI documentation](https://v7.mui.com/x/api/date-pickers/date-range-picker/) for more details.
Unlike the MUI components, these components use an object with `start` and `end` properties, both of which use a `string` (`YYYY-MM-DD`) as the value, instead of an array of two `Date` objects, just like the existing components from `@comet/admin-date-time`.

Note: Using these components requires a [MUI X Pro license](https://v7.mui.com/x/introduction/licensing/).

**Using the new `DateRangePicker`**

```diff
-import { FieldContainer } from "@comet/admin";
-import { type DateRange, DateRangePicker } from "@comet/admin-date-time";
+import { type DateRange, FieldContainer, Future_DateRangePicker as DateRangePicker } from "@comet/admin";
 import { useState } from "react";

 export const Example = () => {
     const [dateRangeValue, setDateRangeValue] = useState<DateRange | undefined>();

     return (
         <FieldContainer label="Date-Range Picker">
             <DateRangePicker value={dateRangeValue} onChange={setDateRangeValue} />
         </FieldContainer>
     );
 };
```

**Using the new `DateRangePickerField` in Final Form**

```diff
-import { type DateRange, DateRangeField } from "@comet/admin-date-time";
+import { type DateRange, Future_DateRangePickerField as DateRangePickerField } from "@comet/admin";
 import { Form } from "react-final-form";

 type Values = {
     dateRange: DateRange;
 };

 export const Example = () => {
     return (
         <Form<Values> initialValues={{ dateRange: { start: "2025-07-23", end: "2025-07-25" } }} onSubmit={() => {}}>
             {() => (
-                <DateRangeField name="dateRange" label="Date-Range Picker" />
+                <DateRangePickerField name="dateRange" label="Date-Range Picker" />
             )}
         </Form>
     );
 };
```
