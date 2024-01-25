---
"@comet/admin": major
---

Remove the `disabled` and `focusVisible` class key and rename `inner` class key to `content` in `AppHeaderButtonClassKey`

Use the `:disabled` selector on `root` instead when styling the disabled state.
Use the `:focus` selector on `root` instead when styling the focus state.
Use the `content` prop instead of `inner` to override styles.
