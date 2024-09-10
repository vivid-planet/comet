---
"@comet/cli": patch
---

inject-site-configs: Add sane defaults for preloginEnabled

When `preloginEnabled` is `undefined` or `null` set it to `true`
on environments != `prod` or `local`.
