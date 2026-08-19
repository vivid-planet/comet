---
"@dextinity/eslint-config": minor
---

Add Oxlint configurations

[Oxlint](https://oxc.rs/docs/guide/usage/linter) is a linter written in Rust that runs orders of magnitude faster than ESLint.
The package now ships Oxlint configurations next to the existing ESLint configurations, so projects can switch linter without losing rules.

Rules Oxlint doesn't implement natively (`@dextinity/*`, `formatjs/*`, `@calm/react-intl/*`, `simple-import-sort/*`, `unused-imports/*`) keep working: Oxlint runs the existing ESLint plugins as [JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins).

Formatting is not part of linting anymore. The Oxlint configurations don't include `eslint-plugin-prettier`, use [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) instead.

The configurations enable Oxlint's `correctness` category, which includes rules of its own `unicorn` and `oxc` plugins. Expect a few additional findings compared to the ESLint configurations.

**Example**

```js
// In oxlint.config.mts
import reactConfig from "@dextinity/eslint-config/oxlint/react.js";
import { defineConfig } from "oxlint";

export default defineConfig({
    extends: [reactConfig],
    ignorePatterns: ["src/**/*.generated.ts"],
});
```

The ESLint configurations are unchanged and keep working.
See the [migration guide](https://cms-docs.dextinity.com/docs/migration-guide/migration-from-v10-to-v11) for the differences between both setups.
