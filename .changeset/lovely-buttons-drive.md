---
"@comet/eslint-config": minor
---

Add new custom eslint rule to restrict the usage of process.env

Projects using the old build and the pages directory should disable these rules.

-   add the `"no-restricted-syntax": "off",` to the projects eslint config to disable
