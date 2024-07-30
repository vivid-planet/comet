---
"@comet/admin": major
---

Remove the `components` and `componentProps` props from `CopyToClipboardButton`

Instead, for the icons, use the `copyIcon` and `successIcon` props to pass a `ReactNode` instead of separately passing in values to the `components` and `componentProps` objects.
Use `slotPops` to pass props to the remaining elements.
