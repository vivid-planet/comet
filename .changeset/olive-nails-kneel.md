---
"@comet/eslint-config": major
"@comet/eslint-plugin": major
---

Add and enable `no-comet-lib-import` ESLint rule

This rule prevents importing private files from `@comet/*/lib`. For example, the following import would be forbidden:

```ts
import { something } from "@comet/admin/lib/some/private/file";
```
