---
"@comet/admin": major
---

Require `intl` in `MuiThemeProvider`

This is necessary to support translating the labels for custom Data Grid filter operators, namely "search".

**How to upgrade**

Make sure that `MuiThemeProvider` is wrapped by `IntlProvider` in your application:

```tsx
// IntlProvider needs to be rendered before MuiThemeProvider.
<IntlProvider locale="en" messages={getMessages()}>
    <MuiThemeProvider theme={theme}>{/* ... */}</MuiThemeProvider>
</IntlProvider>
```
