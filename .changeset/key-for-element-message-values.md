---
"@dextinity/cms-admin": patch
---

Fix the "Each child in a list should have a unique key prop" warning in `createListBlock` and the TipTap block dialog

`FormattedMessage` returns an array when a value is a React element. The `itemName`, `itemsName` and `displayName` values are usually a `FormattedMessage` and are now wrapped in a keyed `Fragment`.
