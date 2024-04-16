---
"@comet/admin-date-time": major
---

Change `DatePicker` and `DateRangePicker` values from `Date` to `string`

This affects the `value` prop and the value returned by the `onChange` event.

The value of `DatePicker` is a string in the format `YYYY-MM-DD`.
The value of `DateRangePicker` is an object with `start` and `end` keys, each as a string in the format `YYYY-MM-DD`.

The code that handles values from these components may need to be adjusted.
This may include how the values are stored in or sent to the database.

```diff
-   const [date, setDate] = useState<Date | undefined>(new Date("2024-03-10"));
+   const [date, setDate] = useState<string | undefined>("2024-03-10");
    return <DatePicker value={date} onChange={setDate} />;
```

```diff
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
-       start: new Date("2024-03-10"),
-       end: new Date("2024-03-16"),
+       start: "2024-03-10",
+       end: "2024-03-16",
    });
    return <DateRangePicker value={dateRange} onChange={setDateRange} />;
```

The reason for this change is that when selecting a date like `2024-04-10` in a timezone ahead of UTC, it would be stored in a `Date` object as e.g. `2024-04-09T22:00:00.000Z`. When only the date is saved to the database, without the time, it would be saved as `2024-04-09`, which differs from the selected date.
