---
"@comet/cms-admin": patch
"@comet/admin": patch
"@comet/cms-api": patch
---

Handle unauthorized and unauthenticated correctly in error dialog

The error dialog now presents screens according to the current state. Required to work in all conditions:

-   `CurrentUserProvider` must be beneath `MuiThemeProvider` and `IntlProvider` and above `RouterBrowserRouter`
-   `ErrorDialogHandler` must be parallel to `CurrentUserProvider`
