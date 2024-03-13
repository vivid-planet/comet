---
"@comet/admin": major
---

Remove `endAdornment` prop from `FinalFormSelect` component

The reason were conflicts with the clearable prop. This decision was based on the fact that MUI doesn't support endAdornment on selects (see: [mui/material-ui#17799](https://github.com/mui/material-ui/issues/17799)), and that there are no common use cases where both `endAdornment` and `clearable` are needed simultaneously.
