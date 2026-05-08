---
"@comet/eslint-config": major
"@comet/eslint-plugin": major
---

Prevent lib imports from `@comet/` packages

Use `no-restricted-imports` to prevent importing private files from `@comet/*/lib`. For example, the following import would be forbidden:

```ts
import { something } from "@comet/admin/lib/some/private/file";
```
