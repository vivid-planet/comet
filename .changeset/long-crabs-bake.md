---
"@comet/admin-color-picker": major
"@comet/admin-react-select": major
"@comet/admin-date-time": major
"@comet/admin-rte": major
"@comet/admin": major
---

The objects `components` and `componentProps` in which the icons and their props were passed separately got removed.

Instead the `copyIcon` and the `successIcon` can be passed now as `React.Nodes` with their props through the `inProps` of the `CometAdminCopyToClipboardButton`.
