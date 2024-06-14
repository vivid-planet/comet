---
"@comet/cms-admin": patch
"@comet/admin": patch
"@comet/cms-api": patch
---

Handle unauthorized and unauthenticated correctly in error dialog

The error dialog now presents screens according to the current state. Required to work in all conditions:

-   `ErrorDialogHandler` must be beneath `MuiThemeProvider` and `IntlProvider`
-   `CurrentUserProvider` must be beneath or parallel to `ErrorDialogHandler`
