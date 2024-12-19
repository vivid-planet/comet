---
"@comet/eslint-config": major
---

Enable rule to restrict barrel React imports

Importing `React` is no longer necessary due the new JSX transform, which automatically imports the necessary `react/jsx-runtime` functions.
Use individual named imports instead, e.g, `import { useState } from "react"`.
