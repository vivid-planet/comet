---
"@comet/eslint-config": major
---

Enforce separate type imports instead of inline type imports

Change `fixStyle` to `"separate-type-imports"` to avoid import side effects and prevent import cycles by using `import type { X }` instead of `import { type X }`.
