---
"@comet/admin-date-time": minor
"@comet/cms-admin": minor
---

Add support for `startAdornment` and `endAdornment` in generated Forms

Adornments are currently supported for the following field types: `text`, `number`, `numberRange`, `date`.

They can be defined in three ways: as just a `string`, an object with an icon name `string` or as an object with options.

Example with just a string:

```
{
    type: "number",
    name: "price",
    startAdornment: "€",
}
```

Example with an icon name:

```
{
    type: "date",
    name: "availableSince",
    startAdornment: { icon: "CalendarToday" },
}
```

Example with an object:

```
{
    type: "date",
    name: "availableSince",
    startAdornment: { icon: { name: "CalendarToday", color: "warning" }},
}
```
