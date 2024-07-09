---
"@comet/eslint-config": patch
---

Fix Prettier peer dependency

The dependency range was incorrectly set to `>= 2`. Change to `^2.0.0` since Prettier v3 isn't supported at the moment.
