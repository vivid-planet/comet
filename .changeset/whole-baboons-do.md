---
"@comet/admin": minor
---

Add new `DateTimeRangePicker` and `DateTimeRangePickerField` components

The new components are based on the `@mui/x-date-pickers-pro` package, so you can refer to the [MUI documentation](https://v7.mui.com/x/api/date-pickers/date-time-range-picker/) for more details.
Unlike the MUI components, these components use an object with `start` and `end` properties, both of which use a `Date` object as the value, instead of an array of two `Date` objects.

Note: Using these components requires a [MUI X Pro license](https://v7.mui.com/x/introduction/licensing/).

**Using the new `DateTimeRangePicker`**

```tsx
import { type DateTimeRange, FieldContainer, DateTimeRangePicker } from "@comet/admin";
import { useState } from "react";

export const Example = () => {
    const [dateTimeRangeValue, setDateTimeRangeValue] = useState<DateTimeRange | undefined>();

    return (
        <FieldContainer label="Date-Time Range Picker">
            <DateTimeRangePicker value={dateTimeRangeValue} onChange={setDateTimeRangeValue} />
        </FieldContainer>
    );
};
```

**Using the new `DateTimeRangePickerField` in Final Form**

```tsx
import { type DateTimeRange, FieldContainer, DateTimeRangePicker } from "@comet/admin";
import { useState } from "react";

type Values = {
    dateTimeRange: DateTimeRange;
};

export const Example = () => {
    return (
        <Form<Values>
            initialValues={{ dateTimeRange: { start: new Date("2025-07-23 11:30:00"), end: new Date("2025-07-25 14:30:00") } }}
            onSubmit={() => {}}
        >
            {() => <DateTimeRangePickerField name="dateTimeRange" label="Date-Time Range Picker" />}
        </Form>
    );
};
```
