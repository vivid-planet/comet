---
"@comet/cli": patch
---

Cache `getSiteConfigs` and `op read` calls to avoid redundant execution

When a template contains multiple placeholders for the same environment, `getSiteConfigs(env)` and `op read` were called repeatedly with identical arguments. Both are now cached per invocation so each unique `env` and each unique `op://` URI is resolved only once.
