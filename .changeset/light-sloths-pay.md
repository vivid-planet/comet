---
"@comet/eslint-config": patch
---

Fix import restriction of `@mui/material` components: `Alert`, `Button`, `Dialog`, `Tooltip`

The restriction was not working for deep imports like `import Button from "@mui/material/Button"`.
