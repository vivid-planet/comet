---
"@comet/eslint-config": minor
---

Enforce separate type imports instead of inline type imports

Add `@typescript-eslint/no-import-type-side-effects` rule and change `fixStyle` to `"separate-type-imports"` to disallow inline type imports (`import { type X }`) in favor of separate type imports (`import type { X }`).
