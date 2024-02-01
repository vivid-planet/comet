---
"@comet/admin": major
---

Change theming method of `Menu`

-   Rename `permanent` class key to `permanentDrawer` and `temporary` class key to `temporaryDrawer`
-   Delete `permanentDrawerProps` and `temporaryDrawerProps`, use `slotProps` instead
-   Instead of using the `style` prop for `PaperProps` in PermanentDrawer and TemporaryDrawer, use the `sx` prop.
