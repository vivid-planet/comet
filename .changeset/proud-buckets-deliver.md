---
"@comet/admin-theme": minor
---

Allow to pass args to createCometTheme to support localization via theme

See https://mui.com/material-ui/guides/localization/

```tsx
import { deDE } from "@mui/x-data-grid-pro";

const theme = createCometTheme({}, deDE);

<MuiThemeProvider theme={theme} />;
```
