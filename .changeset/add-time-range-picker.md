---
"@comet/admin": minor
---

Add `TimeRangePicker` and `TimeRangePickerField` components

These MUI X-based components complete the set of date/time components in `@comet/admin` and replace the deprecated `TimeRangePicker`, `TimeRangeField` and `FinalFormTimeRangePicker` from `@comet/admin-date-time`.

The `value` and the value passed to `onChange` are a `TimeRange` object with `start` and `end` as 24-hour time strings (`HH:mm`):

```ts
type TimeRange = {
    start: string | null;
    end: string | null;
};
```
