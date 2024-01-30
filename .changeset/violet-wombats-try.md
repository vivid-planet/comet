---
"@comet/admin": major
---

Remove the `popoverPaper` class key, rename `popoverRoot` to `popover` in `AppHeaderDropdownClassKey`

Instead of using `styleOverrides` for `popoverPaper` in the theme, use the `slotProps` and `sx` props. 
Use the `popover` prop instead of `popoverRoot` to override styles.