---
"@comet/eslint-config": minor
---

Future: Ban `node-cache` because it's unmaintained

Introduce a new rule in `future/nestjs` and `future/nextjs` that bans importing `node-cache` and recommends `cache-manager` / `@cacheable/node-cache` / `@nestjs/cache-manager` instead.

This rule is now in the future configs and will be enforced generally in v9.
